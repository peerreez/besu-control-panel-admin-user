# Dockerfile
FROM hyperledger/besu:latest

# Expose the required ports for RPC and WebSocket
EXPOSE 8545 8546

# Start Besu node with default options (overridable)
ENTRYPOINT ["besu"]
CMD ["--network=host", "--rpc-http-enabled", "--rpc-ws-enabled", "--rpc-http-cors-origins=all", "--rpc-http-api=ETH,NET,WEB3,CLIQUE,ADMIN"]
