import zernio from "../config/zernio.js";
import { Account } from "../models/Account.js";
import { User } from "../models/User.js";
// Helper to ensure user has a Zernio Profile.
const getOrCreateZernioProfile = async (user) => {
    try {
        const result = await zernio.profiles.listProfiles();
        const data = result.data;
        const profiles = Array.isArray(data)
            ? data
            : data?.profiles || data?.data || [];
        if (profiles.length > 0) {
            const pid = profiles[0]._id || profiles[0].id;
            await User.findByIdAndUpdate(user._id, { zernioProfileId: pid });
            return pid;
        }
        const createResult = await zernio.profiles.createProfile({
            body: { name: `${user.name || user.email}'s workspace` },
        });
        const created = createResult.data?.profile ||
            createResult.data?.data ||
            createResult.data;
        const pid = created?._id || created?.id;
        if (!pid) {
            throw new Error("Failed to create Zernio profile - no ID returned");
        }
        await User.findByIdAndUpdate(user._id, { zernioProfileId: pid });
        return pid;
    }
    catch (error) {
        console.error("getOrCreateZernioProfile Error:", error?.message || error);
        throw error;
    }
};
// Generate OAuth authorization URL
// GET /api/auth/:platform
export const generateAuthUrl = async (req, res) => {
    try {
        const { platform } = req.params;
        const authUser = req.user;
        if (!authUser) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
        const profileId = await getOrCreateZernioProfile(authUser);
        const origin = req.headers.origin;
        const redirectUrl = `${origin}/accounts`;
        const result = await zernio.connect.getConnectUrl({
            path: { platform: platform },
            query: {
                profileId,
                redirect_url: redirectUrl,
            },
        });
        const data = result.data;
        console.log("getConnectUrl response:", JSON.stringify(data, null, 2));
        const authUrl = data.authUrl;
        if (!authUrl) {
            res.status(500).json({ message: "Failed to generate auth URL" });
            return;
        }
        res.status(200).json({ authUrl });
    }
    catch (error) {
        console.error("generateAuthUrl Error:", error?.message || error);
        res
            .status(500)
            .json({ message: error?.message || "Failed to generate auth URL" });
    }
};
// Connect social account
// POST /api/social/connect
export const connectSocialAccount = async (req, res) => {
    try {
        const { userId, platform, redirectUrl } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const profileId = user.zernioProfileId || (await getOrCreateZernioProfile(user));
        const connectResult = await zernio.connect.getConnectUrl({
            path: { platform },
            query: { profileId, redirect_url: redirectUrl },
        });
        res.status(200).json(connectResult.data);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: error?.message || "Failed to connect social account" });
    }
};
// Sync accounts
// GET /api/accounts/sync
export const syncAccounts = async (req, res) => {
    try {
        const authUser = req.user;
        const user = authUser || (await User.findById(req.body.userId));
        if (!user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
        const profileId = await getOrCreateZernioProfile(user);
        const result = await zernio.accounts.listAccounts({
            query: { profileId },
        });
        const data = result.data;
        const zernioAccounts = data?.accounts || (Array.isArray(data) ? data : []);
        const supportedPlatforms = ["twitter", "linkedin", "facebook", "instagram"];
        const syncedAccounts = [];
        for (const zAccount of zernioAccounts) {
            const zid = zAccount._id || zAccount.id;
            if (!zid) {
                console.warn("Skipping account with no ID:", zAccount);
                continue;
            }
            const rawPlatform = zAccount.platform || zAccount.type || "";
            const normalizedPlatform = rawPlatform
                .toLowerCase()
                .replace("x", "twitter");
            if (!supportedPlatforms.includes(normalizedPlatform)) {
                console.log(`Skipping unsupported platform: "${rawPlatform}"`);
                continue;
            }
            const account = await Account.findOneAndUpdate({ zernioAccountId: zid }, {
                user: user._id,
                platform: normalizedPlatform,
                handle: zAccount.username || zAccount.name || zAccount.handle || "Unknown",
                zernioAccountId: zid,
                status: "connected",
                avatarUrl: zAccount.avatarUrl ||
                    zAccount.picture ||
                    zAccount.profile_image_url,
            }, { upsert: true, returnDocument: "after" });
            syncedAccounts.push(account);
        }
        res.status(200).json(syncedAccounts);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: error?.message || "Failed to sync accounts" });
    }
};
export const syncSocialAccounts = syncAccounts;
// Get connected accounts
// GET /api/social/accounts/:userId
export const getSocialAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ user: req.params.userId });
        res.status(200).json(accounts);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: error?.message || "Failed to get social accounts" });
    }
};
