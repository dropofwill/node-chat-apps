UDP Chat Application
========

# Running

Start a server with `npm run server`, will be automatically configured to broadcast on localhost

Start a server on a specific broadcast address using an env variable

    $ ADDRESS=127.255.255.255 npm run server

Start a server on the first available network interface by setting LOOPBACK to false:

    $ LOOPBACK=false npm run server

Clients can be started in the same fashion, only with client instead of server (e.g. `npm run client`)


# Commands

/me <predicate>, e.g. /me is tired -> John is tired

/switch <new name> e.g. /switch Joe -> John is now known as Joe

/rolls <number|6>, e.g. /rolls 18 -> Joe rolled a D18 and got a 2 or /rolls -> Joe rolled a D6 and got 4.
