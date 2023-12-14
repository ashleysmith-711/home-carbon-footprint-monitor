import pandas as pd


def main():
    balancing_authority = "CISO"
    df_ba = pd.read_csv(
        f"https://www.eia.gov/electricity/gridmonitor/knownissues/xls/{balancing_authority}.xlsx"
    )


if __name__ == "__main__":
    main()
