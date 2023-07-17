'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"favicon-16x16.png": "c8769d306de6b0008973aff3867d8a56",
"version.json": "4be2210305dcc8c36c5bf22867aaa058",
"favicon.ico": "080a092f78df8b843faf59cad30a4922",
"index.html": "ddd91cca4834259b597f69f07287a9dc",
"/": "ddd91cca4834259b597f69f07287a9dc",
"apple-icon.png": "680990b2c90677fca643f3401a01be8c",
"apple-icon-144x144.png": "6c75fd053b7835381d1cfd3139ae9b88",
"android-icon-192x192.png": "a5c57fbb220dc634b157a62145ede7bf",
"apple-icon-precomposed.png": "680990b2c90677fca643f3401a01be8c",
"apple-icon-114x114.png": "d701204022f25ba6a8f4e82362121dca",
"main.dart.js": "c5c8a81528f087e45c74475edee9b686",
"ms-icon-310x310.png": "4c88ff3b386147ac9bf7753e76dcc91a",
"ms-icon-144x144.png": "6c75fd053b7835381d1cfd3139ae9b88",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"apple-icon-57x57.png": "dfb466abb1db25c6ce7b9fd2b544c09b",
"apple-icon-152x152.png": "27efb861dd74e05b8d3dfa78e58eb4ad",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"ms-icon-150x150.png": "1e496bef9d1e55ff03e5da3b8819381c",
"android-icon-72x72.png": "f3b5ba94b6df20b4192663699016c2a0",
"android-icon-96x96.png": "389df5db703d76fb50f2c0e46af94007",
"android-icon-36x36.png": "0e98d35b42fa2868e6f5dec701cdf4ca",
"apple-icon-180x180.png": "366ca68e12c582ecf833a2aabc17fdc2",
"favicon-96x96.png": "389df5db703d76fb50f2c0e46af94007",
"manifest.json": "b58fcfa7628c9205cb11a1b2c3e8f99a",
"android-icon-48x48.png": "df9ef008ecc9cc068408dd9da9b04aff",
"apple-icon-76x76.png": "6c40aa2adefeb0e1ff07e10abc8106f6",
"apple-icon-60x60.png": "ea1dfebf28c0daf4f890192aeb683675",
"assets/AssetManifest.json": "d9159e5f9acd4ea61fdc559d6109b404",
"assets/NOTICES": "eaef711bb8a2c46edc02caf9ef4cba5a",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "437227d9368e082cc1da51e872ca4c73",
"assets/packages/flutter_image_compress_web/assets/pica.min.js": "6208ed6419908c4b04382adc8a3053a2",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"assets/AssetManifest.smcbin": "57f4dc6e9afcfbbeefe327c23070ea14",
"assets/fonts/MaterialIcons-Regular.otf": "7db81770ce88eb70130065809b14b111",
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
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
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
