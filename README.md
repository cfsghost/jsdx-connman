jsdx-connman
---
jsdx-connman is written in Node.js, and aims to provide standard JavaScript APIs to manage network connections. It's based on ConnMan which is lightweight and less dependencies than others. That means no need to install fat GNOME Network Manager anymore.

install
---
```$npm install```

fix dbus error on embedded devices
---
on embedded devices without display for X11
if this error shows up: self.connection = dbus._dbus.getBus(1);
make sure to add variables below to process environment
source: http://stackoverflow.com/questions/8556777/dbus-php-unable-to-launch-dbus-daemon-without-display-for-x11

```
process.env.DISPLAY = ':0';
process.env.DBUS_SESSION_BUS_ADDRESS = 'unix:path=/run/dbus/system_bus_socket';
```

License
-
Licensed under the MIT License

Authors
-
Copyright(c) 2012 Fred Chien <<fred@mandice.com>>

Copyright
-
Copyright(c) 2012 Mandice Company.
(http://www.mandice.com/)
