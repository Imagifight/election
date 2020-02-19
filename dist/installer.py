from urllib.request import urlopen
from zipfile import ZipFile
from os import remove
from subprocess import Popen
from tkinter import filedialog, messagebox
from tkinter import *

root = Tk()
root.withdraw()
messagebox.showinfo("Electable Installer", "Electable (c) 2019 Romir Kulshrestha\n<romir.kulshrestha@gmail.com>\n\nThe use of this software is governed by the MIT License. For more information, see license.txt.")
if not messagebox.askokcancel("Electable Installer | MongoDB", "This software requires MongoDB to be installed. If MongoDB is not installed, click 'Cancel' below and install MongoDB before proceeding with the installation."):
    exit(0)
messagebox.showinfo("Electable Installer | MongoDB", "Please select the location of MongoDB (mongod.exe).")
root.mongodir =  filedialog.askdirectory()
print("MongoDB: ", root.mongodir)
messagebox.showinfo("Electable Installer | Installation directory", "Please select the location to install to.")
root.installdir =  filedialog.askdirectory()
print("Root: ", root.installdir)

dist = 'https://github.com/romirk/election/blob/master/dist/electable.zip?raw=true'
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

s.close()

p = Popen("install.bat", cwd=root.installdir)
stdout, stderr = p.communicate()

print("\tdone.")
messagebox.showinfo("Electable Installer | Complete", "Installation completed successfully.")

