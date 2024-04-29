package com.kandi.site;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

public class App{
    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);
        Gson gson = new Gson();

        // Root route
        server.createContext("/", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                String response = "Welcome to the Simple HTTP Server!";
                sendResponse(exchange, response, 200);
            }
        });

        // About route
        server.createContext("/posts", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                String response = "here"; 
                
                sendResponse(exchange, response, 200);
            }
        });

        // Echo route with dynamic URI
        server.createContext("/echo", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                String query = exchange.getRequestURI().getQuery(); // Get query string from URI
                String response = "Echoing back your query: " + query;
                sendResponse(exchange, response, 200);
            }
        });

        server.start();
        System.out.println("Server is listening on port 8000");
    }

    private static void sendResponse(HttpExchange exchange, String response, int statusCode) throws IOException {
        exchange.sendResponseHeaders(statusCode, response.getBytes().length);
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
}
