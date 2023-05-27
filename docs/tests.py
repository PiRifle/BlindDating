#-*- coding: utf-8 -*-

import codecs
import json

f = codecs.open("hobbies1.json", "r", 'utf8')
data = f.read()


dataparse = json.loads(data)
data_theme = []
data_main = []
theme = ""

for idx, i in enumerate(dataparse):
    if "–" in str(i):
        s = str(i).split(" – ")
        data_theme.append({"value": s[0], "label": i})
    elif theme != "":
        data_main.append({"data": data_theme, "theme": theme})
        data_theme = []
        theme = str(i)
    else:
        theme = str(i)

for i in data_main:
    print(i)
import sys
f = codecs.open("hobbies_converted.json", "w", 'utf8')
f.write(json.dumps(data_main, ensure_ascii=False).encode(
    sys.stdout.encoding).decode(sys.stdout.encoding))
