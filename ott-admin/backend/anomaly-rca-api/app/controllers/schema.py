from pydantic import BaseModel
from typing import List

class LabeledAnomalyRecordsPayload(BaseModel):
    m_video_start_time: str
    networkType: str
    dts: str
    m_rebuffering_ratio: str
    device_id: str
    ANOMALY_SCORE: str
    device_platform: str
    cdn: str
    live: str
    ANOMALY_EXPLANATION: str
    approved: str
    sessionid: str
    manufacturer: str
    location_city: str
    m_bandwidth: str
    content_partner: str
    has: str
    ANOMALY_ID: str
    drm: str
    is_approved:str


class LabeledAnomalyPayload(BaseModel):
    userid: str
    records: List[LabeledAnomalyRecordsPayload]
    upload_time: int


class MitigationPlanSchema(BaseModel):
    mitigationType : str
    Recepients : List[str]
    plan_name : str
    Subject : str

    @classmethod
    def from_mitigation_plan(cls, ):
        return cls(
            plan_name = cls.plan_name,
            mitigationType = cls.mitigationType,
            Recepients = cls.Recepients,
            Subject = cls.Subject
                   )



class RCASchema(BaseModel):
    bucket_name : str
    plan_name : str

    @classmethod
    def from_rca_records(cls):
        return cls(
            bucket_name = cls.bucket_name,
            plan_name = cls.plan_name
                   )

