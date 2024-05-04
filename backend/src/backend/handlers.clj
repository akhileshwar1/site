(ns backend.handlers
  (:require [backend.post :as p]
            [ring.util.response :refer [response bad-request]]))

(defn insert-post-handler
  [conn]
  (fn [req]
    (let [post (p/map->Post (:body req))]
      (if (p/insert-post conn post)
        (response {:status "success" :message "The post was inserted successfully!"})
        (response {:status "error", :message "Failed to insert document"})))))

(defn get-posts-handler
  [conn]
  (fn [req]
    (->> (:query-params req)
         (vals)
         (map #(Integer/parseInt %))
         (apply (partial p/get-posts conn))
         (into [])
         (response))))

(defn get-post-by-id-handler
  [conn]
  (fn [req]
    (let [id (get-in req [:path-params :id])]
      (if (p/valid-objectid? id)
        (->> (p/get-post-by-id conn id)
             (into {})
             (response))
        (bad-request "Invalid id")))))
