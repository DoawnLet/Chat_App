"use client";

import React from "react";
import SearchInterface from "./SearchInterface";

interface TaskSearchProps {
  initialQuery?: string;
}

const TaskSearch: React.FC<TaskSearchProps> = ({ initialQuery = "" }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <SearchInterface initialQuery={initialQuery} />
    </div>
  );
};

export default TaskSearch;
