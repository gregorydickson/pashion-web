
dataSource{

	properties {
	       // Documentation for Tomcat JDBC Pool
	       // http://tomcat.apache.org/tomcat-7.0-doc/jdbc-pool.html#Common_Attributes
	       // https://tomcat.apache.org/tomcat-7.0-doc/api/org/apache/tomcat/jdbc/pool/PoolConfiguration.html
	       jmxEnabled = true
	       initialSize = 5
	       maxActive = 50
	       minIdle = 5
	       maxIdle = 25
	       maxWait = 10000
	       maxAge = 10 * 60000
	       timeBetweenEvictionRunsMillis = 5000
	       minEvictableIdleTimeMillis = 60000
	       validationQuery = "SELECT 1"
	       validationQueryTimeout = 3
	       validationInterval = 15000
	       testOnBorrow = true
	       testWhileIdle = true
	       testOnReturn = false
	       ignoreExceptionOnPreLoad = true
	       // http://tomcat.apache.org/tomcat-7.0-doc/jdbc-pool.html#JDBC_interceptors
	       jdbcInterceptors = "ConnectionState;StatementCache(max=200)"
	       defaultTransactionIsolation = java.sql.Connection.TRANSACTION_READ_COMMITTED // safe default
	       // controls for leaked connections 
	       abandonWhenPercentageFull = 100 // settings are active only when pool is full
	       removeAbandonedTimeout = 120
	       removeAbandoned = true
	       // use JMX console to change this setting at runtime
	       logAbandoned = false // causes stacktrace recording overhead, use only for debugging
	       // JDBC driver properties
	       // Mysql as example
	       dbProperties {
	           // Mysql specific driver properties
	           // http://dev.mysql.com/doc/connector-j/en/connector-j-reference-configuration-properties.html
	           // let Tomcat JDBC Pool handle reconnecting
	           autoReconnect=false
	           // truncation behaviour 
	           jdbcCompliantTruncation=false
	           // mysql 0-date conversion
	           zeroDateTimeBehavior='convertToNull'
	           // Tomcat JDBC Pool's StatementCache is used instead, so disable mysql driver's cache
	           cachePrepStmts=false
	           cacheCallableStmts=false
	           // Tomcat JDBC Pool's StatementFinalizer keeps track
	           dontTrackOpenResources=true
	           // performance optimization: reduce number of SQLExceptions thrown in mysql driver code
	           holdResultsOpenOverStatementClose=true
	           // enable MySQL query cache - using server prep stmts will disable query caching
	           useServerPrepStmts=false
	           // metadata caching
	           cacheServerConfiguration=true
	           cacheResultSetMetadata=true
	           metadataCacheSize=100
	           // timeouts for TCP/IP
	           connectTimeout=15000
	           socketTimeout=120000
	           // timer tuning (disable)
	           maintainTimeStats=false
	           enableQueryTimeouts=false
	           // misc tuning
	           noDatetimeStringSync=true
	       }
	    
	}
}

grails.cache.config = {
    cache {
    	name 'mycache'
        eternal false
      	timeToIdleSeconds 86400
      	timeToLiveSeconds 86400
      	overflowToDisk true
      	maxElementsOnDisk 10000000
      	diskPersistent false
      	diskExpiryThreadIntervalSeconds 120
      	memoryStoreEvictionPolicy 'LRU'
    }
}