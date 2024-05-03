(ns backend.server 
  (:require [ring.util.response :as response]
            [ring.middleware.json :refer [wrap-json-body wrap-json-response]]))

(defn app [request]
  {:status 200
   :headers {"Content-Type" "text/plain"}
   :body "Hello, World!"})

(defn wrap-defaults [handler]
  (-> handler
      (wrap-json-body)
      (wrap-json-response)))
