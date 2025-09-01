const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting MERN Collaboration Tool Desktop App...');

// Start the backend server
console.log('📡 Starting backend server...');
const serverProcess = spawn('npm', ['run', 'server'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Wait a bit for server to start
setTimeout(() => {
  console.log('⚛️  Starting React client...');
  const clientProcess = spawn('npm', ['run', 'client'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  // Wait for React to compile and start
  setTimeout(() => {
    console.log('🖥️  Launching Electron desktop app...');
    const electronProcess = spawn('npm', ['run', 'electron'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: true
    });

    // Handle process cleanup
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down all processes...');
      serverProcess.kill();
      clientProcess.kill();
      electronProcess.kill();
      process.exit();
    });
  }, 10000); // Wait 10 seconds for React to compile
}, 3000); // Wait 3 seconds for server to start
