(ns backend.handlers
  (:require [backend.post :refer [get-posts]]
            [ring.util.response :as resp]))

(defn get-posts-handler
  [conn]
  (fn [_req]
    (->> (get-posts conn)
         (into {})
         (resp/response))))
