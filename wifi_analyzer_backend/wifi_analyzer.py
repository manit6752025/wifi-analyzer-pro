import os
_d = os.path.dirname(os.path.abspath(__file__))
_src = open(os.path.join(_d, 'server.py')).read().replace('PORT = 199', 'PORT = 8765')
exec(compile(_src, 'server.py', 'exec'))
