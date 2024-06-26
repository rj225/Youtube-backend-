import {Like} from "../models/like.models.js"
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"
import { Video } from "../models/video.models.js"
import {Tweet} from "../models/tweet.models.js"
import { User } from "../models/user.models.js"
import { Comment } from "../models/comment.models.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const user = await User.findOne({
        refreshToken: req.cookies.refreshToken,
    })
    if (!user) {
        throw new apiError(404, "User not found")
    }

    // Check if the video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new apiError(404, "Video not found");
    }

    // Check if the user has already liked the video
    const existingLike = await Like.findOne({ video: videoId, likedBy: user._id });

    if (existingLike) {
        // User has already liked the video, so remove the like
        await Like.findByIdAndDelete(existingLike._id);
        return (
            res
            .status(200)
            .json(new apiResponse(200, {}, "Like removed successfully")));
    } else {
        // User has not liked the video, so add a new like
        const newLike = await Like.create({ video: videoId, likedBy: user._id });
        return (
            res
            .status(200)
            .json(new apiResponse(200, newLike, "Like added successfully")));
    }
});


const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const user = await User.findOne({
        refreshToken: req.cookies.refreshToken,
    })
    if (!user) {
        throw new apiError(404, "User not found")
    }

    // Check if the comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new apiError(404, "Comment not found");
    }

    // Check if the user has already liked the comment
    const existingLike = await Like.findOne({ comment: commentId, likedBy: user._id });

    if (existingLike) {
        // User has already liked the comment, so remove the like
        await Like.findByIdAndDelete(existingLike._id);

        return (
            res
            .status(200)
            .json(new apiResponse(200, {}, "Like removed successfully")));
    } else {
        // User has not liked the comment, so add a new like
        const newLike = await Like.create({ comment: commentId, likedBy: user._id });

        return (
            res
            .status(200)
            .json(new apiResponse(200, newLike, "Like added successfully")));
    }
});


const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const user = await User.findOne({
        refreshToken: req.cookies.refreshToken,
    })
    if (!user) {
        throw new apiError(404, "User not found")
    }

    // Check if the tweet exists
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new apiError(404, "Tweet not found");
    }

    // Check if the user has already liked the tweet
    const existingLike = await Like.findOne({ tweet: tweetId, likedBy: user._id });

    if (existingLike) {
        // User has already liked the tweet, so remove the like
        await Like.findByIdAndDelete(existingLike._id);
        
        return (
            res
            .status(200)
            .json(new apiResponse(200, {}, "Like removed successfully")));
    } else {
        // User has not liked the tweet, so add a new like
        const newLike = await Like.create({ tweet: tweetId, likedBy: user._id });

        return (
            res
            .status(200)
            .json(new apiResponse(200, newLike, "Like added successfully")));
    }
});


const getLikedVideos = asyncHandler(async (req, res) => {
    const user = await User.findOne({
        refreshToken: req.cookies.refreshToken,
    })
    if (!user) {
        throw new apiError(404, "User not found")
    }

    // Find all likes by the user
    const likes = await Like.find({ likedBy: user._id, video: { $exists: true } }).populate('video');

    if (!likes) {
        return res.status(200).json(new apiResponse(200, [], "No liked videos found"));
    }

    // Extract video details from the likes
    const likedVideos = likes.map(like => like.video);

    return (
        res
        .status(200)
        .json(new apiResponse(200, likedVideos, "Liked videos fetched successfully"))
        );
});

const getLikedComments = asyncHandler(async (req, res) => {
    const user = await User.findOne({
        refreshToken: req.cookies.refreshToken,
    });
    if (!user) {
        throw new apiError(404, "User not found");
    }

    // Find all likes by the user
    const likes = await Like.find({ likedBy: user._id, comment: { $exists: true } }).populate('comment');

    if (!likes) {
        return res.status(200).json(new apiResponse(200, [], "No liked comments found"));
    }

    // Extract comment details from the likes
    const likedComments = likes.map(like => like.comment);

    return res.status(200).json(new apiResponse(200, likedComments, "Liked comments fetched successfully"));
});



export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getLikedComments
}