(ns backend.post
  (:require [clojure.tools.logging :as log]
            [monger.query :refer [find paginate with-collection]]
            [monger.collection :as mc])
  (:import org.bson.types.ObjectId))

(defrecord Post [_id uuid title author content date]) ;id for mongo retrieval, and uuid foruniqueness across all systems (maybe in future).

(defn Post?
  "Returns true if the given value is an instance of Post."
  [x]
  (instance? Post x))

(defn valid-objectid?
  "Checks if the provided string is a valid MongoDB ObjectId."
  [id]
  (ObjectId/isValid id))

(defn transform-result
  "Transforms the result returned by the mongo client."
  [result]
  {:pre [(map? result)]}
  (map->Post result))

(defn prepare-post
  "Prepares the post as a map to be inserted into mongo."
  [post]
  {:pre [Post? post]}
  (into {} post))

(defn insert-post
  "Inserts the post into mongo."
  [conn post]
  (when (Post? post)
    (mc/insert-and-return (:db conn) "posts" (prepare-post post))))

(defn get-posts
  "Gets the posts for a particular page."
  [conn page limit]
  (let [result (with-collection (:db conn) "posts"
                 (find {})
                 (paginate :page page :per-page limit))
        _ (log/info "result is=========" result)]
    (map transform-result result)))

(defn get-post-by-id
  "Gets the post with the specific id, else says missing id."
  [conn id]
  (when (valid-objectid? id)
    (let [result (mc/find-one-as-map (:db conn) "posts" {:_id (ObjectId. id)})
          _ (log/info "result is" result)]
      (transform-result result))))
