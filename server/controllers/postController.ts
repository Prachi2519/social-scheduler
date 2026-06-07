import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import {
  InferenceClient,
  type InferenceProviderOrPolicy,
} from "@huggingface/inference";
import { Generation } from "../models/Generation.js";
import { cloudinary } from "../config/cloudinary.js";
import { Post } from "../models/Post.js";

type PostRequest = AuthRequest & {
  file?: {
    buffer: Buffer;
  };
};

const getErrorMessage = (error: any) => {
  const message =
    error?.response?.data?.error?.message ||
    error?.response?.data?.message ||
    error?.message;

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return "Unknown error";
};

const getMissingEnvNames = (names: string[]) =>
  names.filter((name) => !process.env[name]?.trim());

const hasCloudinaryConfig = () =>
  getMissingEnvNames([
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ]).length === 0;

const assertCloudinaryConfig = () => {
  const missing = getMissingEnvNames([
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ]);

  if (missing.length > 0) {
    throw new Error(
      `Cloudinary is not configured. Missing: ${missing.join(", ")}.`,
    );
  }
};

const getHuggingFaceToken = () =>
  process.env.HF_TOKEN?.trim() || process.env.HUGGINGFACE_API_KEY?.trim();

const getHuggingFaceImageModel = () => {
  const model = process.env.HF_IMAGE_MODEL?.trim() || "Qwen/Qwen-Image";

  return model.replace(/:(fastest|balanced|quality)$/i, "");
};

const assertHuggingFaceConfig = () => {
  if (!getHuggingFaceToken()) {
    throw new Error(
      "HF_TOKEN is missing. Add your Hugging Face token to server/.env.",
    );
  }
};

const toPublicImageError = (error: any) => {
  const message = getErrorMessage(error);
  const normalized = message.toLowerCase();

  if (
    normalized.includes("cloudinary") ||
    normalized.includes("cloud_name") ||
    normalized.includes("api_key") ||
    normalized.includes("api_secret")
  ) {
    return "Cloudinary is not configured correctly. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to server/.env, then restart the server.";
  }

  if (normalized.includes("hf_token") || normalized.includes("hugging face")) {
    return "Hugging Face is not configured. Add HF_TOKEN to server/.env, then restart the server.";
  }

  if (
    normalized.includes("sufficient permissions") ||
    normalized.includes("inference providers") ||
    normalized.includes("authentication method")
  ) {
    return "Your Hugging Face token is valid, but it does not have Inference Providers permission. Create a new token with Inference Providers access, update HF_TOKEN in server/.env, then restart the server.";
  }

  if (
    normalized.includes("quota") ||
    normalized.includes("rate") ||
    normalized.includes("credits") ||
    normalized.includes("429")
  ) {
    return "Hugging Face image generation quota or rate limit was reached. Check your Inference Providers billing/quota and try again later.";
  }

  if (
    normalized.includes("not found") ||
    normalized.includes("unsupported") ||
    normalized.includes("permission") ||
    normalized.includes("403") ||
    normalized.includes("404")
  ) {
    return "The Hugging Face image model/provider is not available for this token. Check HF_IMAGE_MODEL and your Inference Providers access.";
  }

  if (
    normalized.includes("no image data") ||
    normalized.includes("empty image")
  ) {
    return "Hugging Face returned no image data. Try a clearer visual prompt or switch HF_IMAGE_MODEL.";
  }

  return `Image generation failed: ${message}`;
};

const uploadImageBufferToCloudinary = async (buffer: Buffer): Promise<string> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "ai-generations", resource_type: "image" },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url) {
          reject(new Error("Image upload failed - no secure URL returned"));
          return;
        }

        resolve(result.secure_url);
      },
    );

    stream.end(buffer);
  });

const bufferToDataUrl = (buffer: Buffer, mimeType = "image/png") =>
  `data:${mimeType};base64,${buffer.toString("base64")}`;

const normalizeTopic = (prompt: string) =>
  prompt
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.]+$/g, "");

const getHashtags = (prompt: string) => {
  const words = normalizeTopic(prompt)
    .split(/[^a-zA-Z0-9]+/)
    .filter((word) => word.length > 3)
    .slice(0, 4);
  const uniqueTags = [...new Set(words.map((word) => `#${word}`))];

  return [...uniqueTags, "#SocialMedia", "#ContentStrategy"].slice(0, 6);
};

const generateDraftContent = (prompt: string, tone?: string) => {
  const topic = normalizeTopic(prompt);
  const selectedTone = tone || "Professional";

  const openings: Record<string, string> = {
    Creative: `${topic} deserves more than a quick post. It deserves a moment people can feel.`,
    Funny: `${topic} is proof that progress can be serious work without taking itself too seriously.`,
    Minimalist: `${topic}. Clear focus. Strong intent. One next step.`,
    Excited: `${topic} is live energy: momentum, clarity, and a reason to show up today.`,
    Professional: `${topic} is a practical reminder that consistent execution builds visible momentum.`,
  };

  const body: Record<string, string> = {
    Creative:
      "Turn the idea into a visual story, keep the message simple, and give your audience one thing worth remembering.",
    Funny:
      "Show the human side, make the benefit obvious, and give people a reason to stop scrolling without forcing the punchline.",
    Minimalist:
      "Lead with the value. Remove the noise. Make the action obvious.",
    Excited:
      "Share the spark, highlight the transformation, and invite your audience into the next move.",
    Professional:
      "Use the moment to connect the problem, the value, and the next action in a way that feels clear and useful.",
  };

  const closing: Record<string, string> = {
    Creative: "What would you make people feel first?",
    Funny: "What are you making easier today?",
    Minimalist: "What is the next move?",
    Excited: "What are you building next?",
    Professional: "What is the priority you want your audience to remember?",
  };

  return {
    content: `${openings[selectedTone] || openings.Professional}\n\n${
      body[selectedTone] || body.Professional
    }\n\n${closing[selectedTone] || closing.Professional}\n\n${getHashtags(
      topic,
    ).join(" ")}`,
    imagePrompt: `${topic}, ${selectedTone.toLowerCase()} social media campaign visual, editorial composition, realistic lighting, premium brand aesthetic, clean focal subject, no text, no watermark`,
  };
};

const buildSocialImagePrompt = (imagePrompt: string, content: string) => `
Create a polished, platform-ready social media visual for this post.
Image direction: ${imagePrompt}
Post copy context: ${content}

Style requirements:
- high-quality editorial marketing visual
- clean composition with clear focal point
- suitable for LinkedIn, Instagram, Facebook, and X
- no watermarks, fake UI, or brand logos
- avoid large embedded text unless the prompt specifically asks for it
`;

const imageResultToBuffer = async (image: unknown): Promise<Buffer> => {
  if (typeof image === "string") {
    if (image.startsWith("data:")) {
      const base64 = image.split(",")[1];
      if (!base64) throw new Error("Hugging Face returned empty image data");
      return Buffer.from(base64, "base64");
    }

    const response = await fetch(image);
    if (!response.ok) {
      throw new Error(
        `Failed to download Hugging Face image: ${response.status}`,
      );
    }

    return Buffer.from(await response.arrayBuffer());
  }

  if (
    image &&
    typeof image === "object" &&
    "arrayBuffer" in image &&
    typeof (image as { arrayBuffer: () => Promise<ArrayBuffer> }).arrayBuffer ===
      "function"
  ) {
    return Buffer.from(
      await (image as { arrayBuffer: () => Promise<ArrayBuffer> }).arrayBuffer(),
    );
  }

  throw new Error("Hugging Face returned no image data");
};

const generateHuggingFaceImage = async (
  imagePrompt: string,
  content: string,
): Promise<string> => {
  assertHuggingFaceConfig();

  const client = new InferenceClient(getHuggingFaceToken());
  const model = getHuggingFaceImageModel();
  const provider = (process.env.HF_IMAGE_PROVIDER ||
    "fal-ai") as InferenceProviderOrPolicy;
  const steps = Number(process.env.HF_IMAGE_STEPS || 5);
  const width = Number(process.env.HF_IMAGE_WIDTH || 1024);
  const height = Number(process.env.HF_IMAGE_HEIGHT || 1024);
  const request = {
    provider,
    model,
    inputs: buildSocialImagePrompt(imagePrompt, content),
    parameters: {
      num_inference_steps: Number.isFinite(steps) ? steps : 5,
      width: Number.isFinite(width) ? width : 1024,
      height: Number.isFinite(height) ? height : 1024,
      negative_prompt:
        "low quality, blurry, distorted, watermark, logo, extra text, bad anatomy",
    },
  };

  try {
    const imageUrl = await client.textToImage(request, { outputType: "url" });

    if (imageUrl) {
      return imageUrl;
    }
  } catch (error) {
    console.warn(
      "Hugging Face URL output unavailable, falling back to blob:",
      getErrorMessage(error),
    );
  }

  const image = await client.textToImage(request);
  const buffer = await imageResultToBuffer(image);

  if (hasCloudinaryConfig()) {
    return uploadImageBufferToCloudinary(buffer);
  }

  return bufferToDataUrl(buffer);
};

// Generate post
// POST /api/posts/generate
export const generatePost = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { prompt, tone, generateImage } = req.body;

    if (!prompt?.trim()) {
      res.status(400).json({
        message: "Prompt is required.",
      });
      return;
    }

    const { content, imagePrompt } = generateDraftContent(prompt, tone);

    let mediaUrl = "";
    let imageStatus: "skipped" | "generated" | "failed" = generateImage
      ? "failed"
      : "skipped";
    let imageError: string | undefined;

    if (generateImage) {
      try {
        mediaUrl = await generateHuggingFaceImage(imagePrompt, content);
        if (mediaUrl) {
          imageStatus = "generated";
          imageError = undefined;
        }
      } catch (err: any) {
        imageError = toPublicImageError(err);
        console.error("Image generation failed:", getErrorMessage(err));
      }
    }

    const generation = await Generation.create({
      user: req.user?._id,
      prompt,
      content,
      mediaUrl,
      mediaType: mediaUrl ? "image" : undefined,
      imageStatus,
      imageError,
      tone,
    });

    res.status(201).json(generation);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

// Get generations
// GET /api/posts/generations
export const getGenerations = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const generations = await Generation.find({ user: req.user?._id }).sort({
      createdAt: -1,
    });
    res.json(generations);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

// Get posts
// GET /api/posts
export const getPosts = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const posts = await Post.find({ user: req.user?._id });
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

// Schedule post
// POST /api/posts
export const schedulePost = async (
  req: PostRequest,
  res: Response,
): Promise<void> => {
  try {
    const { content, platforms, scheduledFor, status } = req.body;

    // Parse platforms if it comes as a stringified array from FormData
    let parsedPlatforms = platforms;
    if (typeof platforms === "string") {
      try {
        parsedPlatforms = JSON.parse(platforms);
      } catch (e) {
        parsedPlatforms = platforms.split(",");
      }
    }

    let mediaUrl: string | undefined = req.body.mediaUrl;
    let mediaType: "image" | "video" | undefined = req.body.mediaType;

    if (req.file) {
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "social-scheduler" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        stream.end(req.file!.buffer);
      });

      mediaUrl = result.secure_url;
      mediaType = result.resource_type === "video" ? "video" : "image";
    }

    const post = await Post.create({
      user: req.user?._id,
      content,
      platforms: parsedPlatforms,
      mediaUrl,
      mediaType,
      scheduledFor,
      status,
    });

    res.status(201).json(post);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};
