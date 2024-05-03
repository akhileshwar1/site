(ns backend.post
  (:require [clojure.tools.logging :as log]
            [monger.collection :as mc]))

(defrecord Post [title author content date])

(defn Post?
  "Returns true if the given value is an instance of Post."
  [x]
  (instance? Post x))

(defn transform-result
  "Transforms the result returned by the mongo client."
  [result]
  {:pre [(map? result)]}
  (map->Post result))

(defn prepare-record
  "Prepares the record as a map to be inserted into mongo."
  [record]
  {:pre [Post? record]}
  (into {} record))


(defn get-posts
  "Gets the posts."
  [conn]
  (let [coll "posts"
        result (mc/find-one-as-map (:db conn) coll {:author "Akhil Kandi"})
        _ (log/info "result is=========" result)]
    (transform-result result)))
