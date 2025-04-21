import React, { useEffect, useState } from "react";
import axios from "axios";

const TaskStatistics = () => {
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/tasks/statistics/")
      .then(response => {
        setStatistics(response.data);
      })
      .catch(error => {
        console.error("Error fetching task statistics:", error);
      });
  }, []);

  if (!statistics) {
    return <div>Loading statistics...</div>;
  }

  return (
    <div className="container">
      <h2>Task Statistics</h2>
      <div>
        <p>Total Tasks: {statistics.total_tasks}</p>
        <p>Open Tasks: {statistics.open_tasks}</p>
        <p>In Progress Tasks: {statistics.in_progress_tasks}</p>
        <p>Done Tasks: {statistics.done_tasks}</p>
      </div>
    </div>
  );
};

export default TaskStatistics;
