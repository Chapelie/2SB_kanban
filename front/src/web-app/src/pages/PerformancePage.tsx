import React from 'react';
import { useEffect, useState } from 'react';
import { FaChartLine } from 'react-icons/fa';

const PerformancePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState<any>(null);

  useEffect(() => {
    // Simulate fetching performance data
    setTimeout(() => {
      setPerformanceData({
        metrics: {
          projects: 10,
          tasks: 50,
          completedTasks: 30,
          pendingTasks: 20,
        },
      });
      setIsLoading(false);
    }, 800);
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="px-6 py-4 pb-16 max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Performance Metrics <FaChartLine className="inline-block ml-2" />
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Projects</h3>
            <div className="text-2xl font-bold mt-1">{performanceData.metrics.projects}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
            <div className="text-2xl font-bold mt-1">{performanceData.metrics.tasks}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-500">Completed Tasks</h3>
            <div className="text-2xl font-bold mt-1">{performanceData.metrics.completedTasks}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-500">Pending Tasks</h3>
            <div className="text-2xl font-bold mt-1">{performanceData.metrics.pendingTasks}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;