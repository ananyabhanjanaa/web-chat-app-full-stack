import React from "react";

const ChatShimmer = () => {
    return (
        <>
            {Array(10)
                .fill("")
                .map((_, idx) => (
                    <div
                        key={idx}
                        className="w-full h-16 border border-blue-500/50 rounded-lg flex items-center p-3 gap-3 
                        bg-gradient-to-r from-gray-800 to-gray-900 animate-shimmer transition-all 
                        cursor-pointer shadow-md shadow-blue-500/20 relative overflow-hidden"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent animate-shimmer"></div>

                        {/* Profile Image */}
                        <div className="h-12 w-12 rounded-full bg-gray-700"></div>

                        {/* Chat Text Placeholder */}
                        <div className="flex flex-col w-full space-y-2">
                            <div className="h-3 w-3/4 rounded bg-gray-700"></div>
                            <div className="h-3 w-1/2 rounded bg-gray-700"></div>
                        </div>
                    </div>
                ))}
        </>
    );
};

export const ChatShimmerSmall = () => {
    return (
        <>
            {Array(10)
                .fill("")
                .map((_, idx) => (
                    <div
                        key={idx}
                        className="w-full h-12 border border-blue-500/50 rounded-lg flex items-center p-2 gap-3 
                        bg-gradient-to-r from-gray-800 to-gray-900 animate-shimmer transition-all 
                        cursor-pointer shadow-md shadow-blue-500/20 relative overflow-hidden"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent animate-shimmer"></div>

                        {/* Profile Image */}
                        <div className="h-10 w-10 rounded-full bg-gray-700"></div>

                        {/* Text Placeholder */}
                        <div className="h-3 w-3/4 rounded bg-gray-700"></div>

                        {/* Icon Placeholder */}
                        <div className="h-8 w-8 rounded bg-gray-700"></div>
                    </div>
                ))}
        </>
    );
};

export default ChatShimmer;

