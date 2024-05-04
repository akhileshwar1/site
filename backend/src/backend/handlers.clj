(ns backend.handlers
  (:require [backend.post :refer [get-posts]]
            [ring.util.response :as resp]))

(defn get-posts-handler
  [conn]
  (fn [req]
    (->> (:query-params req)
         (vals)
         (map #(Integer/parseInt %))
         (apply (partial get-posts conn))
         (into {})
         (resp/response))))
