Auto-merging frontend/package.json
CONFLICT (content): Merge conflict in frontend/package.json
Auto-merging frontend/src/pages/Dashboard.jsx
CONFLICT (content): Merge conflict in frontend/src/pages/Dashboard.jsx
Auto-merging frontend/src/pages/Login.jsx
CONFLICT (content): Merge conflict in frontend/src/pages/Login.jsx
Auto-merging frontend/src/pages/Products.jsx
CONFLICT (content): Merge conflict in frontend/src/pages/Products.jsx
Auto-merging frontend/src/pages/Stock.jsx
CONFLICT (content): Merge conflict in frontend/src/pages/Stock.jsx
Automatic merge failed; fix conflicts and then commit the result.
PS C:\Users\user'\Desktop\PRG 200 Project\Python-project> git add .                   
>> git commit -m "merge ashra/stock - resolved conflicts"
[main 52adc2d] merge ashra/stock - resolved conflicts
PS C:\Users\user'\Desktop\PRG 200 Project\Python-project> git branch -r
  origin/HEAD -> origin/main
  origin/Rubina/CURD-APIs
  origin/ashra/stock
  origin/gurungjessica
  origin/main
  origin/sagal/feature
  origin/sushant/reports
PS C:\Users\user'\Desktop\PRG 200 Project\Python-project> git status
On branch main
Your branch is ahead of 'origin/main' by 8 commits.
  (use "git push" to publish your local commits)

nothing to commit, working tree clean
PS C:\Users\user'\Desktop\PRG 200 Project\Python-project> git merge origin/Rubina/CURD-APIs --allow-unrelated-histories
Auto-merging backend/main.py
CONFLICT (content): Merge conflict in backend/main.py
Automatic merge failed; fix conflicts and then commit the result.
PS C:\Users\user'\Desktop\PRG 200 Project\Python-project> git add .
>> git commit -m "merge Rubina/CURD-APIs - resolved conflicts"
>> git push
[main 94dd46f] merge Rubina/CURD-APIs - resolved conflicts
Enumerating objects: 53, done.
Counting objects: 100% (52/52), done.
Delta compression using up to 8 threads
Compressing objects: 100% (21/21), done.
Writing objects: 100% (21/21), 2.77 KiB | 123.00 KiB/s, done.
Total 21 (delta 16), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (16/16), completed with 8 local objects.
To httcd "C:\Users\user'\Desktop\PRG 200 Project\Python-project\backend" main -> main
>> venv\Scripts\activatep\PRG 200 Project\Python-pro
>> uvicorn main:app --reload
INFO:     Will watch for changes in these directories: ["C:\\Users\\user'\\Desktop\\PRG 200 Project\\Python-project\\backend"]
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12472] using StatReload
python-dotenv could not parse statement starting at line 1
python-dotenv could not parse statement starting at line 9
python-dotenv could not parse statement starting at line 19
Process SpawnProcess-1:
Traceback (most recent call last):
  File "C:\Users\user'\AppData\Local\Programs\Python\Python314\Lib\multiprocessing\process.py", line 320, in _bootstrap
    self.run()
    ~~~~~~~~^^
  File "C:\Users\user'\AppData\Local\Programs\Python\Python314\Lib\multiprocessing\process.py", line 108, in run
    self._target(*self._args, **self._kwargs)
    ~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\user'\AppData\Local\Programs\Python\Python314\Lib\site-packages\uvicorn\_subprocess.py", line 80, in subprocess_started
    target(sockets=sockets)
    ~~~~~~^^^^^^^^^^^^^^^^^
  File "C:\Users\user'\AppData\Local\Programs\Python\Python314\Lib\site-packages\uvicorn\server.py", line 75, in run
    return asyncio_run(self.serve(sockets=sockets), loop_factory=self.config.get_loop_factory())
  File "C:\Users\user'\AppData\Local\Programs\Python\Python314\Lib\asyncio\runners.py", line 204, in run
    return runner.run(main)
           ~~~~~~~~~~^^^^^^
  File "C:\Users\user'\AppData\Local\Programs\Python\Python314\Lib\asyncio\runners.py", line 127, in run
    return self._loop.run_until_complete(task)
           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^
  File "C:\Users\user'\AppData\Local\Programs\Python\Python314\Lib\asyncio\base_events.py", line 719, in run_until_complete
    return future.result()
           ~~~~~~~~~~~~~^^
  File "C:\Users\user'\AppData\Local\Programs\Python\Python314\Lib\site-packages\uvicorn\server.py", line 79, in serve
    await self._serve(sockets)
  File "C:\Users\user'\AppData\Local\Programs\Python\Python314\Lib\site-packages\uvicorn\server.py", line 86, in _serve
    config.load()
    ~~~~~~~~~~~^^
  File "C:\Users\user'\AppData\Local\Programs\Python\Python314\Lib\site-packages\uvicorn\config.py", line 441, in load
    self.loaded_app = import_from_string(self.app)
                      ~~~~~~~~~~~~~~~~~~^^^^^^^^^^
  File "C:\Users\user'\AppData\Local\Programs\Python\Python314\Lib\site-packages\uvicorn\importer.py", line 19, in import_from_string
    module = importlib.import_module(module_str)
  File "C:\Users\user'\AppData\Local\Programs\Python\Python314\Lib\importlib\__init__.py", line 88, in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
           ~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<frozen importlib._bootstrap>", line 1398, in _gcd_import
  File "<frozen importlib._bootstrap>", line 1371, in _find_and_load
  File "<frozen importlib._bootstrap>", line 1342, in _find_and_load_unlocked
  File "<frozen importlib._bootstrap>", line 938, in _load_unlocked
  File "<frozen importlib._bootstrap_external>", line 759, in exec_module
  File "<frozen importlib._bootstrap>", line 491, in _call_with_frames_removed
  File "C:\Users\user'\Desktop\PRG 200 Project\Python-project\backend\main.py", line 6, in <module>
    from routes.weather import router as weather_router
  File "C:\Users\user'\Desktop\PRG 200 Project\Python-project\backend\routes\weather.py", line 5
    <<<<<<< HEAD
    ^^
SyntaxError: invalid syntax