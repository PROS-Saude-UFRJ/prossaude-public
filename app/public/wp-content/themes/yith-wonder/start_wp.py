import subprocess
from pathlib import Path
from colorama import Fore, init
init(autoreset=True)
wp_scripts_path = Path(__file__).resolve().parent / "node_modules" / ".bin" / "wp-scripts"
try:
	result = subprocess.run(
		[str(wp_scripts_path), "start"] + [
			"assets/js/dist/components/bootstrap/forms/control/FormControl.js",
			"assets/js/dist/components/bootstrap/forms/fileAudio/FormAudioFile.js",
			"assets/js/dist/components/bootstrap/forms/fileImage/FormImageFile.js",
			"assets/js/dist/components/bootstrap/forms/filePdf/FormPDFFile.js",
			"assets/js/dist/components/bootstrap/forms/fileVideo/FormVideoFile.js",
		],
		shell=True,
		check=True,
		text=True,
		stdout=subprocess.PIPE,
		stderr=subprocess.PIPE
	)
	print(Fore.GREEN + result.stdout)
except subprocess.CalledProcessError as e:
    print(Fore.RED + f"Execution Exception: {e.stderr}")