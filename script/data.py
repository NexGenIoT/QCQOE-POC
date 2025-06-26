#!/usr/bin/env python3
"""
OpenSearch Weekly Data Generator and Ingestion Script

This script generates simulated video streaming analytics data for a full week
and ingests it directly into OpenSearch, with preview capabilities.
"""

import json
import random
import time
import uuid
import hashlib
import ipaddress
from datetime import datetime, timedelta, timezone
import argparse
import requests
from requests.auth import HTTPBasicAuth
import numpy as np
import sys
from enum import Enum
from typing import List, Dict, Optional, Any

# Configuration
DEFAULT_OPENSEARCH_HOST = "https://localhost:9200"
DEFAULT_INDEX_NAME = "video_analytics"
DEFAULT_USERNAME = "admin"
DEFAULT_PASSWORD = "admin"
DEFAULT_DAYS = 7
DEFAULT_PREVIEW_LIMIT = 3

# Enums (based on the provided schema)
class EventEnum(str, Enum):
    PLAYCLICKED = 'PLAYCLICKED'
    STARTED = 'STARTED'
    STOPPED = 'STOPPED'
    BUFFERING = 'BUFFERING'
    PAUSED = 'PAUSED'
    RESUMED = 'RESUMED'
    ERROR = 'ERROR'
    SEEKED = 'SEEKED'
    NA = 'NA'
    COMPLETED = 'COMPLETED'
    IDLE = 'IDLE'

class DeviceTypeEnum(str, Enum):
    MOBILE = 'Mobile'
    CTV = 'CTV'
    WEB = 'Web'
    FIRESTICK = 'Firestick'
    FIRETV = "FireTv"
    ANDROIDSMARTTV = "AndroidSmartTv"

class DRMEnum(str, Enum):
    WIDEVINE = 'Widevine'
    FAIRPLAY = 'Fairplay'
    PLAYREADY = 'Playready'

class HasEnum(str, Enum):
    HLS = 'HLS'
    MSS = 'MSS'
    DASH = 'DASH'
    UNKNOWN = 'UNKNOWN'

class LiveEnum(str, Enum):
    TRUE = 'true'
    FALSE = 'false'

class NetworkTypeEnum(str, Enum):
    CELLULAR = 'Cellular'
    CELLULAR_2G = 'Cellular-2G'
    CELLULAR_3G = 'Cellular-3G'
    CELLULAR_4G = 'Cellular-4G'
    CELLULAR_5G = 'Cellular-5G'
    WIFI = 'WiFi'

class ContentTypeEnum(str, Enum):
    MOVIES = "MOVIES"
    TV_SHOWS = "TV_SHOWS"
    LIVE = "LIVE"
    SPORT = "SPORT"
    NEWS = "NEWS"

# Sample data values for simulation
PLATFORMS = ["iOS", "Android", "Web", "tvOS", "Roku"]
DEVICE_TYPES = {
    "iOS": [DeviceTypeEnum.MOBILE],
    "Android": [DeviceTypeEnum.MOBILE, DeviceTypeEnum.ANDROIDSMARTTV, DeviceTypeEnum.FIRESTICK, DeviceTypeEnum.FIRETV],
    "Web": [DeviceTypeEnum.WEB],
    "tvOS": [DeviceTypeEnum.CTV],
    "Roku": [DeviceTypeEnum.CTV]
}
CONTENT_PARTNERS = ["Netflix", "HBO", "Disney+", "Prime Video", "Hulu", "AppleTV+", 
                    "SonyLiv", "Hotstar", "Zee5", "Voot", "ShemarooMe", "ErosNow", 
                    "Hoichoi", "SunNxt", "Curiosity"]
CONTENT_PROVIDERS_MAPPING = {
    "Netflix": "Netflix",
    "HBO": "HBO", 
    "Disney+": "Disney+", 
    "Prime Video": "Prime", 
    "Prime": "Prime",
    "Hulu": "Hulu", 
    "AppleTV+": "AppleTV+",
    "SonyLiv": "SonyLiv",
    "Hotstar": "Hotstar",
    "Zee5": "Zee5",
    "ZEE5": "Zee5",
    "Voot": "VootSelect",
    "Voot Select": "VootSelect",
    "ShemarooMe": "ShemarooMe",
    "ErosNow": "ErosNow",
    "Eros Now": "ErosNow",
    "Hoichoi": "Hoichoi",
    "SunNxt": "SunNxt",
    "Curiosity": "Curiosity",
    "Curiosity Stream": "Curiosity"
}
CDNS = ["Akamai", "Cloudfront", "Fastly", "Cloudflare", "Limelight"]
MANUFACTURERS = {
    "iOS": ["Apple"],
    "Android": ["Samsung", "Google", "OnePlus", "Xiaomi", "Oppo", "Vivo", "Amazon"],
    "Web": ["Chrome", "Firefox", "Safari", "Edge"],
    "tvOS": ["Apple"],
    "Roku": ["Roku"]
}
MODELS = {
    "Apple": ["iPhone 12", "iPhone 13", "iPhone 14", "iPad Pro", "iPad Air", "iPad", "Apple TV 4K", "Apple TV HD"],
    "Samsung": ["Galaxy S21", "Galaxy S22", "Galaxy S23", "Galaxy Note 20", "Galaxy Tab S7", "Galaxy Tab S8"],
    "Google": ["Pixel 6", "Pixel 7", "Pixel 8"],
    "OnePlus": ["OnePlus 9", "OnePlus 10", "OnePlus 11"],
    "Xiaomi": ["Mi 11", "Mi 12", "Redmi Note 10", "Redmi Note 11"],
    "Oppo": ["Find X5", "Find X6", "Reno 8", "Reno 9"],
    "Vivo": ["X80", "X90", "V25", "V27"],
    "Amazon": ["Fire TV Stick", "Fire TV Stick 4K", "Fire TV Stick Lite", "Fire TV Cube"],
    "Chrome": ["Windows", "MacOS", "Linux"],
    "Firefox": ["Windows", "MacOS", "Linux"],
    "Safari": ["MacOS", "iOS"],
    "Edge": ["Windows"],
    "Roku": ["Roku Express", "Roku Streaming Stick", "Roku Ultra"]
}
CITIES = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", 
          "London", "Paris", "Tokyo", "Mumbai", "Sydney", "Berlin", "New Delhi", 
          "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Jaipur"]

# Helper functions
def generate_uuid():
    """Generate a random UUID"""
    return str(uuid.uuid4())

def generate_ueid():
    """Generate a random 32-character hex string for ueid"""
    return hashlib.md5(str(random.random()).encode()).hexdigest()

def generate_ip():
    """Generate a random IP address"""
    return str(ipaddress.IPv4Address(random.randint(0, 2**32 - 1)))

def get_device_platform(platform, device_type):
    """Get the device platform value based on flink query logic"""
    if platform == 'Android' and device_type == 'Mobile':
        return 'Android'
    elif platform == 'Android' and device_type == 'Firestick':
        return 'Firestick'
    else:
        return platform

def calculate_event_time(current_time):
    """Generate event timestamp for OpenSearch"""
    return current_time.strftime("%Y-%m-%dT%H:%M:%S.000000+00:00")

def generate_session_data(start_time, end_time, num_sessions=100, hourly_distribution=None):
    """Generate a realistic set of streaming session data for a time period"""
    if hourly_distribution is None:
        # Default hourly distribution - peaks at evening prime time
        hourly_distribution = [
            0.01, 0.01, 0.01, 0.01, 0.01, 0.02,  # 12am-6am
            0.03, 0.05, 0.06, 0.05, 0.04, 0.04,  # 6am-12pm
            0.05, 0.05, 0.05, 0.06, 0.07, 0.09,  # 12pm-6pm
            0.10, 0.10, 0.08, 0.05, 0.03, 0.02   # 6pm-12am
        ]
    
    time_range = (end_time - start_time).total_seconds()
    sessions = []
    
    for _ in range(num_sessions):
        # Calculate timestamp with hourly distribution
        random_offset = random.random() * time_range
        session_time = start_time + timedelta(seconds=random_offset)
        
        # Adjust based on hour of day probability
        hour = session_time.hour
        if random.random() > hourly_distribution[hour] * 3:  # Scale factor to control distribution
            continue
            
        # Select platform and device type
        platform = random.choice(PLATFORMS)
        device_type = random.choice(DEVICE_TYPES[platform])
        
        # Select manufacturer based on platform
        manufacturer = random.choice(MANUFACTURERS[platform])
        model = random.choice(MODELS[manufacturer])
        
        # Content details
        content_partner = random.choice(CONTENT_PARTNERS)
        normalized_provider = CONTENT_PROVIDERS_MAPPING.get(content_partner, content_partner)
        content_type = random.choice(list(ContentTypeEnum))
        live = LiveEnum.TRUE if content_type == ContentTypeEnum.LIVE else LiveEnum.FALSE
        
        # NetworkType based on device
        if device_type == DeviceTypeEnum.MOBILE:
            network_type = random.choices(
                [NetworkTypeEnum.WIFI, NetworkTypeEnum.CELLULAR_4G, NetworkTypeEnum.CELLULAR_5G],
                weights=[0.6, 0.3, 0.1]
            )[0]
        else:
            network_type = NetworkTypeEnum.WIFI
            
        # Session details
        session_id = generate_uuid()
        udid = generate_uuid()
        ueid = generate_ueid()
        
        # Asset details
        asset_duration = random.randint(300, 7200)  # 5 min to 2 hours
        
        # Generate events for this session
        session_events = generate_session_events(
            session_time, 
            platform, 
            device_type, 
            manufacturer,
            model,
            content_partner,
            normalized_provider,
            content_type,
            network_type,
            session_id,
            udid,
            ueid,
            asset_duration,
            live
        )
        
        sessions.extend(session_events)
    
    # Sort by timestamp
    sessions.sort(key=lambda x: x['timestamp'])
    return sessions

def generate_session_events(session_time, platform, device_type, manufacturer, model, 
                           content_partner, provider, content_type, network_type, 
                           session_id, udid, ueid, asset_duration, live):
    """Generate a sequence of events for a single session"""
    events = []
    current_time = session_time
    timestamp = int(current_time.timestamp())
    
    # Calculate session quality parameters
    connection_quality = random.random()  # 0 to 1, where 1 is perfect
    device_quality = random.random()  # 0 to 1, where 1 is perfect
    content_quality = random.random()  # 0 to 1, where 1 is perfect
    
    # Derived metrics based on quality factors
    bitrate = int(500000 + 19500000 * connection_quality)  # 500Kbps to 20Mbps
    average_framerate = 24 + int(36 * device_quality)  # 24 to 60 fps
    throughput = int(bitrate * (1 + random.random()))  # Throughput slightly higher than bitrate
    
    # Buffering and latency metrics
    rebuffering_ratio = max(0, min(1, 0.3 - (0.3 * connection_quality) + random.random() * 0.05))
    startup_buffer_length = int(1000 + 5000 * (1 - connection_quality))  # 1-6 seconds
    video_start_time = int(500 + 4500 * (1 - connection_quality))  # 0.5-5 seconds

    # Common parameters for all events
    common_params = {
        'sessionid': session_id,
        'udid': udid,
        'platform': platform,
        'device_platform': get_device_platform(platform, device_type),
        'deviceType': device_type,
        'manufacturer': manufacturer,
        'model': model,
        'content_partner': content_partner,
        'provider': provider,
        'cdn': random.choice(CDNS),
        'networkType': network_type,
        'content_type': content_type,
        'player': f"{platform}Player",
        'playerApp': f"{content_partner}App",
        'sdkVersion': f"1.{random.randint(0, 9)}.{random.randint(0, 9)}",
        'version': f"{random.randint(1, 9)}.{random.randint(0, 9)}.{random.randint(0, 9)}",
        'live': live,
        'has': random.choice(list(HasEnum)),
        'drm': random.choice(list(DRMEnum)) if random.random() > 0.3 else None,
        'bitrate_bits_per_second': bitrate,
        'framerate': average_framerate,
        'throughput_bits_per_second': throughput,
        'asset_duration_seconds': asset_duration,
        'vCodec': random.choice(["h264", "h265", "vp9", "av1"]),
        'aCodec': random.choice(["aac", "mp3", "opus"]),
        'resolution': random.choice(["640x360", "854x480", "1280x720", "1920x1080", "3840x2160"]),
        'location': random.choice(CITIES),
        'clientIP': generate_ip(),
        'ueid': ueid
    }
    
    # Event sequence generation
    # PLAYCLICKED
    events.append(create_event(
        current_time, EventEnum.PLAYCLICKED, EventEnum.NA, 
        common_params, latency_ms=0, vrt_ms=0, duration=0, stall=0
    ))
    
    # Determine if there's an error or successful playback
    has_error = random.random() > (0.9 * connection_quality)
    
    if has_error and random.random() > 0.5:
        # Error right after PLAYCLICKED
        current_time += timedelta(milliseconds=random.randint(500, 3000))
        events.append(create_event(
            current_time, EventEnum.ERROR, EventEnum.PLAYCLICKED, 
            common_params, latency_ms=0, vrt_ms=0, duration=0, stall=0,
            error_details=generate_error_details()
        ))
        return events
    
    # STARTED
    current_time += timedelta(milliseconds=video_start_time)
    started_event = create_event(
        current_time, EventEnum.STARTED, EventEnum.PLAYCLICKED, 
        common_params, latency_ms=video_start_time, vrt_ms=int(video_start_time * 0.7), 
        duration=0, stall=0
    )
    events.append(started_event)
    
    # Calculate how long the session will last (as percentage of asset duration)
    completion_percentage = min(1, max(0.05, random.random() * content_quality))
    
    # Determine number of events in this session
    num_events = random.randint(1, 10) if completion_percentage > 0.3 else random.randint(1, 3)
    
    # Track accumulated playback duration
    accumulated_duration = 0
    target_duration = int(asset_duration * completion_percentage)
    
    for i in range(num_events):
        # Skip if we've already exceeded target duration
        if accumulated_duration >= target_duration:
            break
            
        segment_duration = min(
            random.randint(10, 300),  # 10s to 5min segments
            target_duration - accumulated_duration
        )
        accumulated_duration += segment_duration
        
        # Progress the time
        current_time += timedelta(seconds=segment_duration)
        
        # Introduce buffering (REBUFFERING event)
        if random.random() < rebuffering_ratio:
            buffering_duration = int(random.randint(100, 5000))  # 0.1-5s
            events.append(create_event(
                current_time, EventEnum.BUFFERING, events[-1]['event'], 
                common_params, latency_ms=0, vrt_ms=0, 
                duration=segment_duration, stall=buffering_duration
            ))
            
            current_time += timedelta(milliseconds=buffering_duration)
            
            # After buffering, either resume or exit
            if random.random() < 0.9:  # 90% chance to resume
                events.append(create_event(
                    current_time, EventEnum.RESUMED, EventEnum.BUFFERING, 
                    common_params, latency_ms=0, vrt_ms=0, 
                    duration=0, stall=0
                ))
            else:
                # User abandons during buffering
                events.append(create_event(
                    current_time, EventEnum.STOPPED, EventEnum.BUFFERING, 
                    common_params, latency_ms=0, vrt_ms=0, 
                    duration=segment_duration, stall=buffering_duration
                ))
                return events

        # Random events during playback
        if i < num_events - 1:  # Not the last event
            event_type = random.choices(
                [EventEnum.PAUSED, EventEnum.SEEKED, EventEnum.ERROR, None],
                weights=[0.4, 0.4, 0.1, 0.1]  # Weights for different events
            )[0]
            
            if event_type:
                if event_type == EventEnum.ERROR:
                    # Error during playback
                    events.append(create_event(
                        current_time, EventEnum.ERROR, events[-1]['event'], 
                        common_params, latency_ms=0, vrt_ms=0, 
                        duration=segment_duration, stall=0,
                        error_details=generate_error_details()
                    ))
                    return events
                    
                elif event_type == EventEnum.PAUSED:
                    # User pauses playback
                    events.append(create_event(
                        current_time, EventEnum.PAUSED, events[-1]['event'], 
                        common_params, latency_ms=0, vrt_ms=0, 
                        duration=segment_duration, stall=0
                    ))
                    
                    # Pause duration
                    pause_duration = random.randint(5, 300)  # 5s to 5min
                    current_time += timedelta(seconds=pause_duration)
                    
                    # Resume after pause
                    events.append(create_event(
                        current_time, EventEnum.RESUMED, EventEnum.PAUSED, 
                        common_params, latency_ms=0, vrt_ms=0, 
                        duration=0, stall=0
                    ))
                    
                elif event_type == EventEnum.SEEKED:
                    # User seeks to a different position
                    events.append(create_event(
                        current_time, EventEnum.SEEKED, events[-1]['event'], 
                        common_params, latency_ms=0, vrt_ms=0, 
                        duration=segment_duration, stall=0
                    ))
    
    # Final event - either COMPLETED or STOPPED
    if accumulated_duration >= asset_duration * 0.95:
        events.append(create_event(
            current_time, EventEnum.COMPLETED, events[-1]['event'], 
            common_params, latency_ms=0, vrt_ms=0, 
            duration=accumulated_duration, stall=0
        ))
    else:
        events.append(create_event(
            current_time, EventEnum.STOPPED, events[-1]['event'], 
            common_params, latency_ms=0, vrt_ms=0, 
            duration=accumulated_duration, stall=0
        ))
        
    return events

def create_event(current_time, event_type, prev_event, common_params, 
                latency_ms, vrt_ms, duration, stall, error_details=None):
    """Create a single event with the specified parameters"""
    timestamp = int(current_time.timestamp())
    
    # Create basic event
    event = {
        'timestamp': timestamp,
        'event_time': timestamp,
        'dts': current_time.strftime("%Y-%m-%dT%H:%M:%S.000Z"),
        'dts_es': current_time.strftime("%Y-%m-%dT%H:%M:%S.000000+00:00"),
        'event': event_type,
        'event_prev': prev_event,
        'duration_of_playback_seconds': duration,
        'stall_duration_milliseconds': stall,
        'vrt_milliseconds': vrt_ms,
        'latency_milliseconds': latency_ms,
        'frameloss': int(random.random() * 100) if random.random() > 0.8 else 0,
        'record_id': str(uuid.uuid4()),
        'm_connection_induced_rebuffering_ratio': round(random.uniform(0, 0.1), 4) if stall > 0 else 0,
    }
    
    # Add error details if applicable
    if event_type == EventEnum.ERROR and error_details:
        event['error_details'] = error_details
    
    # Add all common parameters
    event.update(common_params)
    
    return event

def generate_error_details():
    """Generate random error details"""
    error_types = [
        {"code": "1001", "name": "NETWORK_ERROR", "details": "Network connectivity lost"},
        {"code": "1002", "name": "TIMEOUT_ERROR", "details": "Request timed out"},
        {"code": "1003", "name": "DECODE_ERROR", "details": "Unable to decode media segment"},
        {"code": "1004", "name": "DRM_ERROR", "details": "DRM key acquisition failed"},
        {"code": "1005", "name": "MANIFEST_ERROR", "details": "Failed to parse manifest"},
        {"code": "2001", "name": "MEDIA_ERROR", "details": "Media playback error"},
        {"code": "2002", "name": "RENDERER_ERROR", "details": "Renderer initialization failed"},
        {"code": "3001", "name": "INTERNAL_ERROR", "details": "Internal player error"}
    ]
    return random.choice(error_types)

def aggregate_session_data(sessions_data):
    """Aggregate the session data for OpenSearch based on the Flink SQL aggregation"""
    # Group by 10-second windows
    time_window_groups = {}
    
    for event in sessions_data:
        # Create a 10-second window key
        event_dt = datetime.fromtimestamp(event['timestamp'], timezone.utc)
        window_start = event_dt.replace(microsecond=0, second=event_dt.second // 10 * 10)
        window_key = (
            window_start.isoformat(),
            event['device_platform'],
            event['provider'],
            event['cdn'],
            event['deviceType'],
            event.get('location', 'Unknown'),
            event.get('content_type', 'Unknown')
        )
        
        if window_key not in time_window_groups:
            time_window_groups[window_key] = []
            
        time_window_groups[window_key].append(event)
    
    # Perform aggregation for each group
    aggregated_data = []
    
    for (window_time, platform, provider, cdn, device_type, location, content_type), events in time_window_groups.items():
        # Skip windows with too few events
        if len(events) < 2:
            continue
            
        # Calculate metrics based on the Flink SQL aggregation
        play_attempts = sum(1 for e in events if e['event'] == EventEnum.PLAYCLICKED)
        successful_plays = sum(1 for e in events if e['event'] == EventEnum.STARTED)
        exit_before_video_starts = sum(1 for e in events if e['event'] == EventEnum.STOPPED and e['event_prev'] == EventEnum.PLAYCLICKED)
        video_start_failures = sum(1 for e in events if e['event'] == EventEnum.ERROR and e['event_prev'] == EventEnum.PLAYCLICKED)
        video_playback_failures = sum(1 for e in events if e['event'] == EventEnum.ERROR)
        
        # Get unique session IDs for concurrent plays
        unique_sessions = set(e['sessionid'] for e in events)
        unique_devices = set(e['udid'] for e in events)
        
        # Calculate durations and stalls
        total_stall_duration = sum(e['stall_duration_milliseconds'] for e in events)
        total_playback_duration = sum(e['duration_of_playback_seconds'] for e in events)
        
        # Calculate rebuffering ratio
        if total_stall_duration + total_playback_duration > 0:
            rebuffering_ratio = total_stall_duration / ((total_stall_duration + total_playback_duration * 1000) or 1)
            rebuffering_percentage = rebuffering_ratio * 100
        else:
            rebuffering_ratio = 0
            rebuffering_percentage = 0
            
        # Calculate average bitrate in KBps (bits -> bytes conversion)
        avg_bitrate = sum(e['bitrate_bits_per_second'] for e in events) / (len(events) or 1) / 8000
        
        # Calculate other aggregated metrics
        avg_framerate = sum(e['framerate'] for e in events) / (len(events) or 1)
        avg_throughput = sum(e['throughput_bits_per_second'] for e in events) / (len(events) or 1) / 1000000  # Convert to Mbps
        
        # Video times
        vrt_values = [e['vrt_milliseconds'] for e in events if e['vrt_milliseconds'] > 0]
        avg_vrt = sum(vrt_values) / (len(vrt_values) or 1)
        
        latency_values = [e['latency_milliseconds'] for e in events if e['latency_milliseconds'] > 0]
        avg_latency = sum(latency_values) / (len(latency_values) or 1)
        
        # Calculate rendering quality
        frameloss_sum = sum(e['frameloss'] for e in events)
        potential_frames = total_playback_duration * avg_framerate
        rendering_quality = (potential_frames - frameloss_sum) / (potential_frames or 1)
        
        # Calculate average percentage completion
        total_asset_duration = sum(e['asset_duration_seconds'] for e in events)
        if total_asset_duration > 0:
            avg_completion_percentage = (total_playback_duration / total_asset_duration) * 100
        else:
            avg_completion_percentage = 0
            
        # User attrition
        user_attrition = sum(1 for e in events if e['event'] == EventEnum.STOPPED and e['event_prev'] == EventEnum.BUFFERING)
        
        # Create aggregated event
        window_dt = datetime.fromisoformat(window_time.replace('Z', '+00:00'))
        timestamp = int(window_dt.timestamp())
        
        aggregated_event = {
            'device_platform': platform,
            'content_partner': provider,
            'cdn': cdn,
            'm_average_bitrate': round(avg_bitrate, 2),
            'm_play_attempts': play_attempts,
            'm_succesful_plays': successful_plays,
            'm_exit_before_video_starts': exit_before_video_starts,
            'm_video_start_failures': video_start_failures,
            'm_video_playback_failures': video_playback_failures,
            'm_concurrent_plays': len(unique_sessions),
            'm_rebuffering_ratio': round(rebuffering_ratio, 4),
            'm_total_minutes_watched': round(total_playback_duration / 60, 2),
            'm_unique_devices': len(unique_devices),
            'm_average_framerate': round(avg_framerate, 2),
            'm_bandwidth': round(avg_throughput, 2),
            'm_attempts': play_attempts,
            'm_ended_plays': sum(1 for e in events if e['event'] == EventEnum.STOPPED),
            'm_rebuffering_percentage': round(rebuffering_percentage, 2),
            'm_ended_plays_per_unique_device': round(sum(1 for e in events if e['event'] == EventEnum.STOPPED) / (len(unique_devices) or 1), 2),
            'm_minutes_per_unique_devices': round((total_playback_duration / 60) / (len(unique_devices) or 1), 2),
            'm_unique_viewers': len(unique_sessions),
            'm_average_percentage_completion': round(avg_completion_percentage, 2),
            'm_user_attrition': user_attrition,
            'm_video_restart_time': round(avg_vrt, 2),
            'm_video_start_time': round(avg_latency, 2),
            'm_rendering_quality': round(rendering_quality, 4),
            'dts': window_dt.strftime("%Y-%m-%dT%H:%M:%S.000Z"),
            'dts_es': window_dt.strftime("%Y-%m-%dT%H:%M:%S.000000+00:00"),
            'timestamp': timestamp,
            'm_connection_induced_rebuffering_ratio': round(sum(e.get('m_connection_induced_rebuffering_ratio', 0) for e in events) / len(events), 4),
            'location': location,
            'batch_desc': ",".join(e.get('record_id', '') for e in events[:5]) + "...",
            'm_total_payload_count': len(events),
            'content_type': content_type
        }
        
        aggregated_data.append(aggregated_event)
    
    # Sort by timestamp
    aggregated_data.sort(key=lambda x: x['timestamp'])
    return aggregated_data

def push_to_opensearch(host, index_name, data, username=None, password=None, verify_ssl=False):
    """Push data to OpenSearch using the Bulk API"""
    bulk_data = []
    
    # Create bulk request format
    for item in data:
        # Add index action
        bulk_data.append(json.dumps({"index": {"_index": index_name}}))
        # Add document
        bulk_data.append(json.dumps(item))
    
    # Convert to newline delimited format
    bulk_request_body = "\n".join(bulk_data) + "\n"
    
    # Authentication
    auth = None
    if username and password:
        auth = HTTPBasicAuth(username, password)
    
    # Send request
    url = f"{host}/_bulk"
    headers = {"Content-Type": "application/x-ndjson"}
    
    try:
        response = requests.post(
            url, 
            data=bulk_request_body, 
            headers=headers, 
            auth=auth,
            verify=verify_ssl
        )
        
        if response.status_code >= 200 and response.status_code < 300:
            result = response.json()
            success_count = sum(1 for item in result.get("items", []) if item.get("index", {}).get("status") == 201)
            total_count = len(result.get("items", []))
            
            print(f"Successfully ingested {success_count}/{total_count} documents")
            if result.get("errors", False):
                print("Some documents had errors:")
                for item in result.get("items", []):
                    if item.get("index", {}).get("status") != 201:
                        print(f"Error: {item.get('index', {}).get('error')}")
            return success_count
        else:
            print(f"Error: {response.status_code} - {response.text}")
            return 0
    except Exception as e:
        print(f"Exception occurred while pushing to OpenSearch: {e}")
        return 0

def create_index_if_not_exists(host, index_name, username=None, password=None, verify_ssl=False):
    """Create the index if it doesn't exist with appropriate mappings"""
    auth = None
    if username and password:
        auth = HTTPBasicAuth(username, password)
    
    # Check if index exists
    url = f"{host}/{index_name}"
    try:
        response = requests.head(url, auth=auth, verify=verify_ssl)
        if response.status_code == 200:
            print(f"Index {index_name} already exists")
            return True
    except Exception as e:
        print(f"Error checking if index exists: {e}")
    
    # Create index with mappings
    mappings = {
        "mappings": {
            "properties": {
                "device_platform": {"type": "keyword"},
                "content_partner": {"type": "keyword"},
                "cdn": {"type": "keyword"},
                "m_average_bitrate": {"type": "float"},
                "m_play_attempts": {"type": "integer"},
                "m_succesful_plays": {"type": "integer"},
                "m_exit_before_video_starts": {"type": "integer"},
                "m_video_start_failures": {"type": "integer"},
                "m_video_playback_failures": {"type": "integer"},
                "m_concurrent_plays": {"type": "integer"},
                "m_rebuffering_ratio": {"type": "float"},
                "m_total_minutes_watched": {"type": "float"},
                "m_unique_devices": {"type": "integer"},
                "m_average_framerate": {"type": "float"},
                "m_bandwidth": {"type": "float"},
                "m_attempts": {"type": "integer"},
                "m_ended_plays": {"type": "integer"},
                "m_rebuffering_percentage": {"type": "float"},
                "m_ended_plays_per_unique_device": {"type": "float"},
                "m_minutes_per_unique_devices": {"type": "float"},
                "m_unique_viewers": {"type": "integer"},
                "m_average_percentage_completion": {"type": "float"},
                "m_user_attrition": {"type": "integer"},
                "m_video_restart_time": {"type": "float"},
                "m_video_start_time": {"type": "float"},
                "m_rendering_quality": {"type": "float"},
                "m_connection_induced_rebuffering_ratio": {"type": "float"},
                "location": {"type": "keyword"},
                "batch_desc": {"type": "text"},
                "m_total_payload_count": {"type": "integer"},
                "content_type": {"type": "keyword"},
                "dts": {"type": "date"},
                "dts_es": {"type": "date"},
                "timestamp": {"type": "long"}
            }
        },
        "settings": {
            "number_of_shards": 1,
            "number_of_replicas": 0
        }
    }
    
    try:
        response = requests.put(
            url,
            json=mappings,
            auth=auth,
            verify=verify_ssl,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code >= 200 and response.status_code < 300:
            print(f"Successfully created index {index_name}")
            return True
        else:
            print(f"Error creating index: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"Exception occurred while creating index: {e}")
        return False

def generate_weekly_data(start_date, days=7, events_per_day=1000):
    """Generate a week's worth of data"""
    all_data = []
    
    # Convert start_date string to datetime if needed
    if isinstance(start_date, str):
        start_date = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
    
    for day in range(days):
        print(f"Generating data for day {day+1}/{days}...")
        day_start = start_date + timedelta(days=day)
        day_end = day_start + timedelta(days=1)
        
        # Generate events with a daily pattern (more in evenings)
        daily_events = generate_session_data(day_start, day_end, events_per_day)
        
        # Aggregate the events according to the Flink SQL aggregation
        aggregated_events = aggregate_session_data(daily_events)
        
        all_data.extend(aggregated_events)
        print(f"  Generated {len(aggregated_events)} aggregated records")
    
    return all_data

def preview_data(data, limit=3):
    """Preview the data before pushing to OpenSearch"""
    if not data:
        print("No data to preview")
        return
    
    print(f"\nPreview of {min(limit, len(data))} records out of {len(data)} total:")
    for i, record in enumerate(data[:limit]):
        print(f"\nRecord {i+1}:")
        print(json.dumps(record, indent=2))
    
    print("\nField statistics:")
    
    # Calculate statistics for numeric fields
    numeric_fields = [
        'm_average_bitrate', 'm_play_attempts', 'm_succesful_plays',
        'm_rebuffering_ratio', 'm_total_minutes_watched', 'm_average_framerate',
        'm_bandwidth', 'm_video_restart_time', 'm_video_start_time'
    ]
    
    for field in numeric_fields:
        values = [record.get(field, 0) for record in data]
        if values:
            print(f"  {field}: min={min(values):.2f}, max={max(values):.2f}, avg={sum(values)/len(values):.2f}")
    
    # Distribution of categorical fields
    categorical_fields = ['device_platform', 'content_partner', 'cdn', 'content_type']
    
    for field in categorical_fields:
        distribution = {}
        for record in data:
            value = record.get(field, 'Unknown')
            distribution[value] = distribution.get(value, 0) + 1
        
        print(f"\n  {field} distribution:")
        # Sort by count and print top 5
        sorted_dist = sorted(distribution.items(), key=lambda x: x[1], reverse=True)
        for value, count in sorted_dist[:5]:
            print(f"    {value}: {count} ({count/len(data)*100:.1f}%)")
        if len(sorted_dist) > 5:
            print(f"    ... and {len(sorted_dist)-5} more")

def main():
    """Main function to run the data ingestion"""
    parser = argparse.ArgumentParser(description='Generate and ingest a week of video streaming data into OpenSearch')
    
    parser.add_argument('--host', default=DEFAULT_OPENSEARCH_HOST,
                        help=f'OpenSearch host URL (default: {DEFAULT_OPENSEARCH_HOST})')
    parser.add_argument('--index', default=DEFAULT_INDEX_NAME,
                        help=f'OpenSearch index name (default: {DEFAULT_INDEX_NAME})')
    parser.add_argument('--username', default=DEFAULT_USERNAME,
                        help=f'OpenSearch username (default: {DEFAULT_USERNAME})')
    parser.add_argument('--password', default=DEFAULT_PASSWORD,
                        help=f'OpenSearch password (default: {DEFAULT_PASSWORD})')
    parser.add_argument('--days', type=int, default=DEFAULT_DAYS,
                        help=f'Number of days of data to generate (default: {DEFAULT_DAYS})')
    parser.add_argument('--start-date', default=None,
                        help='Start date for data generation (format: YYYY-MM-DD, default: 7 days ago)')
    parser.add_argument('--events-per-day', type=int, default=1000,
                        help='Number of events to generate per day (default: 1000)')
    parser.add_argument('--preview-limit', type=int, default=DEFAULT_PREVIEW_LIMIT,
                        help=f'Number of records to preview (default: {DEFAULT_PREVIEW_LIMIT})')
    parser.add_argument('--no-push', action='store_true',
                        help='Generate data but do not push to OpenSearch')
    parser.add_argument('--no-verify-ssl', action='store_true',
                        help='Disable SSL certificate verification')
    
    args = parser.parse_args()
    
    # Set start date if not provided
    if args.start_date:
        start_date = datetime.fromisoformat(args.start_date + "T00:00:00+00:00")
    else:
        start_date = datetime.now(timezone.utc) - timedelta(days=args.days)
        start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
    
    print(f"Generating {args.days} days of data starting from {start_date.strftime('%Y-%m-%d')}")
    print(f"Targeting approximately {args.events_per_day} events per day")
    
    # Generate the data
    data = generate_weekly_data(start_date, args.days, args.events_per_day)
    
    # Preview the data
    preview_data(data, args.preview_limit)
    
    if args.no_push:
        print("\nData generation complete. Not pushing to OpenSearch (--no-push specified).")
        save_option = input("Would you like to save the data to a file? (y/n): ").lower().strip()
        if save_option.startswith('y'):
            filename = input("Enter filename (default: opensearch_data.json): ").strip() or "opensearch_data.json"
            with open(filename, 'w') as f:
                json.dump(data, f, indent=2)
            print(f"Data saved to {filename}")
        return
    
    # Confirm before pushing
    confirm = input(f"\nReady to push {len(data)} records to OpenSearch at {args.host}. Continue? (y/n): ")
    if confirm.lower().strip() != 'y':
        print("Aborted.")
        return
    
    # Create index if it doesn't exist
    if not create_index_if_not_exists(
        args.host, 
        args.index, 
        args.username, 
        args.password, 
        not args.no_verify_ssl
    ):
        print("Failed to create index. Exiting.")
        return
    
    # Push data to OpenSearch
    print(f"\nPushing {len(data)} records to OpenSearch...")
    
    # Split into batches of 500 to avoid overwhelming the server
    batch_size = 500
    total_pushed = 0
    
    for i in range(0, len(data), batch_size):
        batch = data[i:i+batch_size]
        print(f"Pushing batch {i//batch_size + 1}/{(len(data) + batch_size - 1)//batch_size}...")
        
        success_count = push_to_opensearch(
            args.host, 
            args.index, 
            batch, 
            args.username, 
            args.password, 
            not args.no_verify_ssl
        )
        
        total_pushed += success_count
        
        # Small delay between batches
        if i + batch_size < len(data):
            time.sleep(1)
    
    print(f"\nData ingestion complete. Successfully ingested {total_pushed}/{len(data)} documents.")

if __name__ == '__main__':
    main()
