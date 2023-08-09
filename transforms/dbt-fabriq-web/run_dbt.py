import subprocess

def watch_dbt_logs(db):
    command = f"dbt run --profiles-dir=./profile/{db}"
    try:
        process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        
        while True:
            output = process.stdout.readline().decode().strip()
            if output == '' and process.poll() is not None:
                break
            if output:
                print(output)
        
        if process.poll() != 0:
            print(f"dbt run completed with errors in {db}.")
        else:
            print(f"{db} dbt run completed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")


db= "pg"
watch_dbt_logs(db)
db = "bq"
watch_dbt_logs(db)

