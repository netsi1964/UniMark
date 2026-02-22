#### 🍏 macOS Installation Guide (Important!)
Because this is a free Open-Source project, it does not use a paid Apple Developer Certificate ($99/year). As a result, macOS's security feature ("Gatekeeper") automatically places the downloaded app in "Quarantine" to protect you from unknown software, which prevents it from running.

You only need to remove this quarantine **once** using a simple Terminal command:

1. **Unzip** the downloaded app `.zip` file so you see the `.app` file.
2. Open the **Terminal** app on your Mac (you can find it via Spotlight Search: `Cmd + Space` -> "Terminal").
3. Type the following command, ending with a single space (do not press enter yet):
   ```bash
   xattr -cr 
   ```
4. **Drag and drop** the `.app` file from Finder directly into the Terminal window. This will automatically paste the correct file path.
5. Press **Enter**. (It won't show any success message, it just goes to the next line).
6. You're done! You can now **double-click** the app in Finder to open it normally forever.
