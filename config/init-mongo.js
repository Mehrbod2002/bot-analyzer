use admin;

db.createUser({ user: "botDBWSSBackend",
    pwd: "sgQRVCeGCJ29WK4zsgQRVCeGCJ2k6A",
    roles: [{ role: "clusterAdmin", db: "admin" }, 
            { role: "readAnyDatabase", db: "admin" },
            "readWrite"
        ]},
    { w: "majority" , wtimeout: 5000 })