import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const DebugComponent = () => {
  const { api } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);

  const testApiConnection = async () => {
    try {
      addLog('Testing API connection to /api/tasks/');
      const response = await api.get('/api/tasks/');
      setApiResponse(response.data);
      addLog(`Success! Received ${response.data.length} tasks`);
    } catch (error) {
      addLog(`Error: ${error.message}`);
      console.error('Full error:', error);
      setApiResponse(null);
    }
  };

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'black',
      color: 'white',
      padding: '10px',
      zIndex: 9999,
      maxHeight: '200px',
      overflow: 'auto'
    }}>
      <button onClick={testApiConnection} style={{ marginBottom: '10px' }}>
        Test API Connection
      </button>
      <div>
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
      {apiResponse && (
        <pre style={{ color: 'lime' }}>
          {JSON.stringify(apiResponse, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default DebugComponent;