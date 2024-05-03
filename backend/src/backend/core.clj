(ns backend.core 
  (:require [integrant.core :as ig]
            [ring.adapter.jetty :as jetty]
            [clojure.java.io :as io]
            [backend.routes :as routes]
            [monger.core :as mg])
  (:import (java.lang Runtime))
  (:gen-class))

(defmethod ig/init-key :mongo/connection [_ config]
  (mg/connect-via-uri (:uri config)))

(defmethod ig/halt-key! :mongo/connection [_ conn]
  (mg/disconnect conn))

(defmethod ig/init-key :adapter/jetty
  [_ {:keys [port mongo-connection]}]
  (jetty/run-jetty (routes/app mongo-connection) {:port port :join? false}))

(defmethod ig/halt-key! :adapter/jetty
  [_ server]
  (.stop server))

(defn read-config []
  (let [content (slurp (io/resource "config.edn"))] (println "Content loaded: " content)  ; Ensure content is correctly loaded
    (let [parsed-data (ig/read-string content)]
      (println "Parsed data: " parsed-data)  ; Check parsed output
      parsed-data)))

(defn -main []
  (let [config (read-config)
        system (ig/init config)]
    (println "Server started on port:" (:port (get-in config [:adapter/jetty])))
    (.addShutdownHook (Runtime/getRuntime) (Thread. (fn [] (ig/halt! system))))
    system))
