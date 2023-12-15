import requests

from datetime import datetime

# Not sure how to properly reorganize the code without this :(
if __name__ == 'api.bayou':
    from .models import CustomerInterval
else:
    from models import CustomerInterval


bayou_domain = "staging.bayou.energy"
bayou_api_key = "test_197_b527b88d4f61e86eb22dc97fe8ff94997cb8028f39e90106b85e011640b30e1f"


def get_intervals_for_customer(customer_id: int):
    datetime_fmt = '%Y-%m-%dT%H:%M:%SZ'
    intervals = []
    response = requests.get(
        f"https://staging.bayou.energy/api/v2/customers/{customer_id}/intervals",
        auth=(bayou_api_key, '')
    ).json()
    print( response.keys())

    for meter in response['meters']:
        for interval in meter['intervals']:
            interval['customer'] = customer_id
            interval['start'] = datetime.strptime(interval['start'], datetime_fmt)
            interval['end'] = datetime.strptime(interval['end'], datetime_fmt)
            intervals.append(CustomerInterval(**interval))

    return intervals
