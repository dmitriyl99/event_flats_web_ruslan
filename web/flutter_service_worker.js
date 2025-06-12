'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"favicon-16x16.png": "c8769d306de6b0008973aff3867d8a56",
"flutter_bootstrap.js": "6471036d23237c0c96c25c3d6cbe0969",
"version.json": "4be2210305dcc8c36c5bf22867aaa058",
"favicon.ico": "080a092f78df8b843faf59cad30a4922",
"index.html": "a015e2866a47c4a733d4f324789df689",
"/": "a015e2866a47c4a733d4f324789df689",
"apple-icon.png": "680990b2c90677fca643f3401a01be8c",
"apple-icon-144x144.png": "6c75fd053b7835381d1cfd3139ae9b88",
"android-icon-192x192.png": "a5c57fbb220dc634b157a62145ede7bf",
"apple-icon-precomposed.png": "680990b2c90677fca643f3401a01be8c",
"apple-icon-114x114.png": "d701204022f25ba6a8f4e82362121dca",
"main.dart.js": "620be616e0dc64570b4087ff48cdf256",
"ms-icon-310x310.png": "4c88ff3b386147ac9bf7753e76dcc91a",
"ms-icon-144x144.png": "6c75fd053b7835381d1cfd3139ae9b88",
"flutter.js": "83d881c1dbb6d6bcd6b42e274605b69c",
"apple-icon-57x57.png": "dfb466abb1db25c6ce7b9fd2b544c09b",
"apple-icon-152x152.png": "27efb861dd74e05b8d3dfa78e58eb4ad",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"ms-icon-150x150.png": "1e496bef9d1e55ff03e5da3b8819381c",
"android-icon-72x72.png": "f3b5ba94b6df20b4192663699016c2a0",
"android-icon-96x96.png": "389df5db703d76fb50f2c0e46af94007",
"android-icon-36x36.png": "0e98d35b42fa2868e6f5dec701cdf4ca",
"apple-icon-180x180.png": "366ca68e12c582ecf833a2aabc17fdc2",
"favicon-96x96.png": "389df5db703d76fb50f2c0e46af94007",
"manifest.json": "c9ff91d6492770e3561fb160296631ec",
"android-icon-48x48.png": "df9ef008ecc9cc068408dd9da9b04aff",
"apple-icon-76x76.png": "6c40aa2adefeb0e1ff07e10abc8106f6",
"apple-icon-60x60.png": "ea1dfebf28c0daf4f890192aeb683675",
"assets/AssetManifest.json": "c45790fdfd4e4e4eb38b1047b11af486",
"assets/NOTICES": "9859b8e0a1535a18665eebccb060d7ac",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/AssetManifest.bin.json": "22693137e6063fe9c68913a14efca4c1",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "99203b17535d59953cacd9ba1151de9f",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "1c8d54ebcff293d0865190f66eddf1b0",
"assets/fonts/MaterialIcons-Regular.otf": "f81a40b759cf783e9ec6876e6af6ec8c",
"assets/assets/house_favorite.png": "a7accbffd4cd8a68183121757d36a7bf",
"assets/assets/filter_white.png": "4130ed82af57a9917165b8ff4e103ab6",
"assets/assets/house.png": "5a6038b61c1621da5be1758b56096cd3",
"assets/assets/splash_screen.png": "5b8e337cbccf3970839db78b2e351e8d",
"browserconfig.xml": "653d077300a12f09a69caeea7a8947f8",
"android-icon-144x144.png": "6c75fd053b7835381d1cfd3139ae9b88",
"apple-icon-72x72.png": "f3b5ba94b6df20b4192663699016c2a0",
"apple-icon-120x120.png": "538de3042555cf13d1bf55144ff16beb",
"favicon-32x32.png": "25ab2d78fb2e6160293157a4b99d170a",
"ms-icon-70x70.png": "76b44dbcf0860dcd569d16e1a9578930",
"canvaskit/skwasm.js": "ea559890a088fe28b4ddf70e17e60052",
"canvaskit/skwasm.js.symbols": "e72c79950c8a8483d826a7f0560573a1",
"canvaskit/canvaskit.js.symbols": "bdcd3835edf8586b6d6edfce8749fb77",
"canvaskit/skwasm.wasm": "39dd80367a4e71582d234948adc521c0",
"canvaskit/chromium/canvaskit.js.symbols": "b61b5f4673c9698029fa0a746a9ad581",
"canvaskit/chromium/canvaskit.js": "8191e843020c832c9cf8852a4b909d4c",
"canvaskit/chromium/canvaskit.wasm": "f504de372e31c8031018a9ec0a9ef5f0",
"canvaskit/canvaskit.js": "728b2d477d9b8c14593d4f9b82b484f3",
"canvaskit/canvaskit.wasm": "7a3f4ae7d65fc1de6a6e7ddd3224bc93"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
