(ns backend.routes
  (:require [muuntaja.core :as m]
            [ring.middleware.json :as json]
            [reitit.ring :as ring]
            [reitit.coercion.spec]
            [reitit.ring.coercion :as rrc]
            [reitit.ring.middleware.muuntaja :as muuntaja]
            [reitit.ring.middleware.parameters :as parameters]
            [ring.middleware.cors :refer [wrap-cors]]
            [backend.middleware :refer [wrap-custom-json-response]]
            [backend.handlers :as handlers]))

(defn handler
  [conn]
  (ring/ring-handler
    (ring/router
      ["/"
       ["posts" {:get {:parameters {:query {:page int? :limit int?}}
                       :handler (handlers/get-posts-handler conn)}
                 :post {:handler (handlers/insert-post-handler conn)}}]
       ["post/:id" {:get {:parameters {:path-params {:id string?}}
                          :handler (handlers/get-post-by-id-handler conn)}}]]

      ;; router data affecting all routes
      {:data {:coercion   reitit.coercion.spec/coercion
              :muuntaja   m/instance
              :middleware [parameters/parameters-middleware
                           rrc/coerce-request-middleware
                           muuntaja/format-response-middleware
                           rrc/coerce-response-middleware
                           wrap-custom-json-response
                           json/wrap-json-body
                           json/wrap-json-response]}})))

(defn app
  [conn]
  (-> (handler conn)
      (wrap-cors :access-control-allow-origin [#".*"]
                 :access-control-allow-methods [:get :post :put :delete])))
