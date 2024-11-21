const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const db = require('./db');
const userHandlers = require('./userHandlers');

// Load gRPC service definition
const PROTO_PATH = __dirname + '/userService.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const userServiceProto = grpc.loadPackageDefinition(packageDefinition).UserService;

// Start gRPC server
function startServer() {
  const server = new grpc.Server();
  server.addService(userServiceProto.UserService.service, userHandlers);
  const PORT = '50051';
  server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`gRPC server running on port ${PORT}`);
    server.start();
  });
}

startServer();