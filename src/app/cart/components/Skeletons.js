import React from "react";

export const SkeletonBox = ({ width = "100%", height = "1rem" }) => (
  <div
    className="bg-gray-200 animate-pulse rounded"
    style={{ width, height }}
  ></div>
);

export const CartItemSkeleton = () => (
  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm animate-pulse">
    <div className="flex items-center gap-4">
      <SkeletonBox width="80px" height="80px" />
      <div className="space-y-2">
        <SkeletonBox width="120px" />
        <SkeletonBox width="80px" />
      </div>
    </div>
    <SkeletonBox width="60px" height="20px" />
  </div>
);
