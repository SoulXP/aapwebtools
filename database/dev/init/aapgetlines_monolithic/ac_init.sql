-- Initialization script for adding users with relevant rights
CREATE USER 'api_remote' WITH PASSWORD 'password123' LOGIN CREATEDB REPLICATION BYPASSRLS;

-- Initialize database for AAP Lines monolithic model
CREATE DATABASE aapgetlines_monolithic;