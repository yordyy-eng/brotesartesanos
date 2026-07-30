import concurrent.futures
import ssl
import time
import urllib.request

urls = [l.strip() for l in open('scratch-cold-urls2.txt', encoding='utf-8') if l.strip()]

INSECURE_CTX = ssl.create_default_context()
INSECURE_CTX.check_hostname = False
INSECURE_CTX.verify_mode = ssl.CERT_NONE

def fetch(url):
    start = time.time()
    try:
        with urllib.request.urlopen(url, timeout=60, context=INSECURE_CTX) as resp:
            resp.read()
            code = resp.status
    except Exception as e:
        code = f'ERR:{e}'
    return url, code, time.time() - start

overall_start = time.time()
results = []
with concurrent.futures.ThreadPoolExecutor(max_workers=40) as ex:
    for r in ex.map(fetch, urls):
        results.append(r)

print("TOTAL WALL TIME:", time.time() - overall_start)
times = sorted(r[2] for r in results)
errs = [r for r in results if not isinstance(r[1], int)]
print("errors:", len(errs))
print("min", times[0], "median", times[len(times)//2], "p90", times[int(len(times)*0.9)], "max", times[-1])
print("slowest 10:", times[-10:])
