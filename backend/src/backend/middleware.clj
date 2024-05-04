(ns backend.middleware
  (:require [cheshire.core :as json]
            [cheshire.generate :as gen]
            [ring.util.response :refer [content-type]])
  (:import [org.bson.types ObjectId]))

(defn- encode-object-id [oid json-generator]
  (.writeString json-generator (str oid)))

;Modifying the cheshire json-encode fn to deal with mongo ObjectIds.
(gen/add-encoder ObjectId encode-object-id)

(defn wrap-custom-json-response [handler]
  (fn [request]
    (let [resp (handler request)]
      (-> resp ;; NOTE: encoding all the responses to json.
          (update :body json/generate-string) ; Ensure this uses the custom encoder
          (content-type "application/json;charset=utf-8"))
      resp)))
