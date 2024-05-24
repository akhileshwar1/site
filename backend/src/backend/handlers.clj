(ns backend.handlers
  (:require [backend.post :as p]
            [clojure.walk :refer [keywordize-keys]]
            [better-cond.core :as better]
            [markdown.core :refer [md-to-html-string]]
            [ring.util.response :refer [response bad-request]]))

(defn insert-post-handler
  [conn]
  (fn [req]
    (better/cond
      :let [post (keywordize-keys (:body req))]

      (not (contains? post :content))
      (response {:status "error", :message "no content provided!"})

      :let [post (-> post
                     (p/map->Post)
                     (update :content md-to-html-string) ;; converting md to html.
                     (assoc :date (java.util.Date.))
                     (assoc :uuid (random-uuid)))]

      (some? (p/insert-post conn post))
      (response {:status "success" :message "The post was inserted successfully!"})

      :else
      (response {:status "error", :message "Failed to insert document"}))))

(defn get-posts-handler
  [conn]
  (fn [req]
    (->> (:query-params req)
         (vals)
         (map #(Integer/parseInt %))
         (apply (partial p/get-posts conn))
         (map #(select-keys % [:title :date]))
         (into [])
         (response))))

(defn get-post-by-title-handler
  [conn]
  (fn [req]
    (if-let [result (p/get-post-by-title conn (get-in req [:path-params :title]))]
      (->> result
           (into {})
           (response))
      (bad-request "No such post"))))
