from urllib.request import urlopen
from zipfile import ZipFile
from os import remove
from subprocess import run
from tkinter import filedialog, messagebox
from tkinter import *

root = Tk()
root.withdraw()
if not messagebox.askokcancel("Electable Installer", "Electable (c) 2019 Romir Kulshrestha\n<romir.kulshrestha@gmail.com>\n\nThis software is governed by the MIT License. For more information, see license.txt."):
    exit(0)
messagebox.showinfo("Electable Installer | MongoDB", "Please select the location of MongoDB (mongod.exe).")
root.mongodir =  filedialog.askdirectory()
print("MongoDB: ", root.mongodir)
messagebox.showinfo("Electable Installer | Installation directory", "Please select the location to install to.")
root.installdir =  filedialog.askdirectory()
print("Root: ", root.installdir)

dist = 'https://github.com/Imagifight/election/blob/master/dist/electable.zip?raw=true'
print("Downloading...")
tmp  = open(root.installdir + '/electable.zip', 'wb+')
zipcontents = urlopen(dist).read()
print('\tdone.')
#print(zipcontents)
tmp.write(zipcontents)
tmp.close()
print("Installing...")
z = ZipFile(root.installdir + '/electable.zip')
z.extractall(path = root.installdir)
z.close()
remove(root.installdir + '/electable.zip')
i = open(root.installdir + '/install.bat', 'w+')
i.write("""
@echo off
cd """ + root.installdir + """
npm i && npm audit fix""")
i.close()
s = open(root.installdir + '/start.bat', 'w+')
s.write("""
@echo off
IF EXIST """ + root.installdir + """/data/db GOTO server
cd """ + root.installdir + """
mkdir .\data\db

:server
start """ + root.mongodir + """/mongod.exe --dbpath=""" + root.installdir + """/data/db
start npm start

exit""")
#run(["start", root.installdir + '/install.bat'])
s.close()

print("\tdone.")
messagebox.showinfo("Electable Installer | Complete", "Installation completed successfully.")

