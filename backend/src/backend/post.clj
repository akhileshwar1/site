(ns backend.post
  (:require [clojure.tools.logging :as log]
            [monger.query :refer [find paginate with-collection]]))

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
  "Gets the posts for a particular page."
  [conn page limit]
  (let [coll "posts"
        result (with-collection (:db conn) coll
                 (find {})
                 (paginate :page page :per-page limit))
        _ (log/info "result is=========" result)]
    (map transform-result result)))
