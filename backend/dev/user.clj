(ns user
  (:require [clojure.java.io :as io]
            [clojure.string :as str]
            [clojure.pprint :refer (pprint)]
            [clojure.repl :refer :all]
            [clojure.test :as test]
            [clojure.tools.namespace.repl :refer (refresh refresh-all)]
            [backend.core :refer [-main]]
            [integrant.core :as ig]))

(def system nil)

(defn start 
  "Constructs the current development system."
  []
  (alter-var-root #'system
    (constantly (-main))))

(defn stop
  "Shuts down and destroys the current development system."
  []
  (alter-var-root #'system
    (fn [s] (when s (ig/halt! s)))))

(defn reset
  "The JVM stops the current system instance, reloads the bytecode of the files
  that have changed, and then starts the system again."

  []
  (stop)
  (refresh :after 'user/start))
