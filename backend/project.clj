(defproject backend "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "EPL-2.0 OR GPL-2.0-or-later WITH Classpath-exception-2.0"
            :url "https://www.eclipse.org/legal/epl-2.0/"}
  :dependencies [[org.clojure/clojure "1.11.1"]
                 [org.clojure/tools.logging "1.2.3"]
                 [ch.qos.logback/logback-classic "1.2.3"]
                 [ring/ring-core "1.8.2"]
                 [ring/ring-jetty-adapter "1.8.2"]
                 [ring/ring-json "0.5.1"]
                 [integrant "0.9.0"]
                 [metosin/reitit "0.7.0"]
                 [com.novemberain/monger "3.5.0"]
                 [environ "1.2.0"]
                 [nrepl/nrepl "0.9.0"]]
  :main ^:skip-aot backend.core
  :resource-paths ["resources"]
  :target-path "target/%s"
  :profiles {:uberjar {:aot :all
                       :jvm-opts ["-Dclojure.compiler.direct-linking=true"]}
             :dev {:source-paths ["dev"]
                   :dependencies [[org.clojure/clojure "1.11.1"]
                                  [org.clojure/tools.namespace "0.2.3"]
                                  [org.clojure/java.classpath "0.2.0"]]
                   :repl-options {:init-ns user}}})
