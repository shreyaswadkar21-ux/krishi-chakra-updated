"""
KrishiChakra - Scheduling & Dynamic Rescheduling Optimizer Core
Mathematical Verification and Automated Test Suite
"""

import math
from datetime import datetime, date, timedelta
from typing import List, Dict, Any, Optional, Tuple

# Speed of agricultural equipment on rural roads (km/h)
EQUIPMENT_SPEEDS = {
    "Tractor": 20.0,
    "Harvester": 14.0,
    "Sprayer": 25.0,
    "Rotavator": 18.0
}
DEFAULT_SPEED = 18.0
SETUP_BUFFER_HOURS = 0.5  # Hookup, cleaning, and field entry preparation
ROAD_WINDING_FACTOR = 1.25 # Rural roads winding factor over straight-line distance

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate realistic rural road distance between two coordinates in kilometers."""
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c * ROAD_WINDING_FACTOR, 2)

def calculate_work_duration(plot_acres: float, work_rate_acres_per_hr: float) -> float:
    """Calculate work duration in hours = acres / rate + 0.5 hr setup."""
    return round((plot_acres / work_rate_acres_per_hr) + 0.5, 2)

def calculate_travel_time(distance_km: float, equipment_type: str) -> float:
    """Calculate transit time in hours + 15 min hitching/transit buffer."""
    speed = EQUIPMENT_SPEEDS.get(equipment_type, DEFAULT_SPEED)
    transit_hours = distance_km / speed
    buffer_hours = 0.25 # 15 min hitch/prep buffer
    return round(transit_hours + buffer_hours, 2)

class Equipment:
    def __init__(self, id: str, name: str, type: str, work_rate: float, rate_per_unit: float,
                 rate_unit: str, location_name: str, lat: float, lon: float, owner_name: str, phone: str):
        self.id = id
        self.name = name
        self.type = type
        self.work_rate = work_rate # acres / hour
        self.rate_per_unit = rate_per_unit # ₹
        self.rate_unit = rate_unit # "hour" or "acre"
        self.location_name = location_name
        self.lat = lat
        self.lon = lon
        self.owner_name = owner_name
        self.phone = phone
        self.status = "Available" # "Available", "In Field", "Maintenance"

class Plot:
    def __init__(self, id: str, farmer_name: str, phone: str, village: str,
                 lat: float, lon: float, acres: float, crop: str,
                 operation: str, window_start: str, window_end: str, required_machine_type: str):
        self.id = id
        self.farmer_name = farmer_name
        self.phone = phone
        self.village = village
        self.lat = lat
        self.lon = lon
        self.acres = acres
        self.crop = crop
        self.operation = operation # "Harvesting", "Sowing", "Spraying", "Tilling"
        self.window_start = datetime.strptime(window_start, "%Y-%m-%d").date()
        self.window_end = datetime.strptime(window_end, "%Y-%m-%d").date()
        self.required_machine_type = required_machine_type

class BookingSlot:
    def __init__(self, booking_id: str, plot: Plot, equipment: Equipment,
                 day_str: str, start_hour: float, end_hour: float,
                 travel_from_prev_hours: float, travel_distance_km: float,
                 prev_location: str, priority_score: float, explanation: str):
        self.booking_id = booking_id
        self.plot = plot
        self.equipment = equipment
        self.day_str = day_str
        self.day_date = datetime.strptime(day_str, "%Y-%m-%d").date()
        self.start_hour = start_hour # e.g. 8.0 = 08:00 AM
        self.end_hour = end_hour     # e.g. 11.5 = 11:30 AM
        self.travel_from_prev_hours = travel_from_prev_hours
        self.travel_distance_km = travel_distance_km
        self.prev_location = prev_location
        self.priority_score = priority_score
        self.explanation = explanation
        self.status = "Confirmed" # "Confirmed", "Rescheduled", "Completed", "Cancelled"

class ScheduleOptimizer:
    def __init__(self, equipment_list: List[Equipment], plots: List[Plot], start_date_str: str, days: int = 7):
        self.equipment_list = equipment_list
        self.plots = plots
        self.start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
        self.days = days
        self.weather_blocks: Dict[str, str] = {} # "YYYY-MM-DD" -> reason
        self.equipment_breakdowns: Dict[str, Dict[str, Any]] = {} # equip_id -> {start_date, end_date, reason}

    def add_weather_block(self, date_str: str, reason: str):
        self.weather_blocks[date_str] = reason

    def remove_weather_block(self, date_str: str):
        self.weather_blocks.pop(date_str, None)

    def add_equipment_breakdown(self, equip_id: str, start_date_str: str, end_date_str: str, reason: str):
        self.equipment_breakdowns[equip_id] = {
            "start": datetime.strptime(start_date_str, "%Y-%m-%d").date(),
            "end": datetime.strptime(end_date_str, "%Y-%m-%d").date(),
            "reason": reason
        }

    def remove_equipment_breakdown(self, equip_id: str):
        self.equipment_breakdowns.pop(equip_id, None)

    def calculate_priority(self, plot: Plot, reference_date: date) -> Tuple[float, str]:
        """
        Calculate deadline priority:
        1. Days left until window_end (slack).
        2. Agronomic penalty weight (Harvesting > Spraying > Sowing > Tilling).
        3. Returns (score, plain_language_explanation).
        """
        slack_days = (plot.window_end - reference_date).days
        
        # Operation severity weights
        op_weights = {
            "Harvesting": 2.0, # High risk of shatter, lodging, moisture loss
            "Spraying": 1.6,   # Pest explosion cycle window
            "Sowing": 1.3,     # Soil moisture evaporation window
            "Tilling": 1.0     # Routine land preparation
        }
        weight = op_weights.get(plot.operation, 1.0)
        
        # Urgency score: lower slack = exponentially higher priority
        if slack_days < 0:
            urgency = 999.0 # Overdue!
            urgency_text = f"OVERDUE by {abs(slack_days)} days!"
        elif slack_days == 0:
            urgency = 100.0
            urgency_text = "FINAL DAY before severe yield loss"
        elif slack_days == 1:
            urgency = 75.0
            urgency_text = "Only 24 hours remaining before deadline"
        elif slack_days <= 3:
            urgency = 40.0 - (slack_days * 5)
            urgency_text = f"{slack_days} days left in critical window"
        else:
            urgency = max(5.0, 25.0 - slack_days)
            urgency_text = f"{slack_days} days remaining (flexible)"

        score = (urgency * weight) + (plot.acres * 0.2)
        
        explanation = (
            f"Prioritized for {plot.farmer_name} ({plot.crop} {plot.operation}, {plot.acres} acres): "
            f"{urgency_text} (Deadline {plot.window_end.strftime('%b %d')}). "
            f"Agronomic risk factor: {weight}x for {plot.operation}."
        )
        return round(score, 2), explanation

    def optimize_schedule(self, reference_date: Optional[date] = None) -> Dict[str, Any]:
        """
        Run global schedule optimization with travel buffer and deadline priority.
        Guarantees zero double-booking and travel gap enforcement.
        """
        if reference_date is None:
            reference_date = self.start_date

        assigned_slots: List[BookingSlot] = []
        unfulfilled: List[Dict[str, Any]] = []

        # Sort plots by priority score descending
        ranked_plots = []
        for p in self.plots:
            score, expl = self.calculate_priority(p, reference_date)
            ranked_plots.append((score, expl, p))
        ranked_plots.sort(key=lambda x: x[0], reverse=True)

        # Machine tracking: current date -> schedule list of (start_hour, end_hour, current_lat, current_lon, location_name)
        # Operating day: 07:00 (7.0) to 18:30 (18.5) daylight limit
        DAY_START = 7.0
        DAY_END = 18.5

        # Track assignments per machine
        machine_schedules: Dict[str, List[BookingSlot]] = {e.id: [] for e in self.equipment_list}

        for score, priority_expl, plot in ranked_plots:
            assigned = False
            rejection_reasons = []

            # Find matching equipment
            eligible_equip = [
                e for e in self.equipment_list
                if e.type == plot.required_machine_type or plot.required_machine_type in e.name
            ]

            if not eligible_equip:
                unfulfilled.append({
                    "plot": plot,
                    "reason": f"No machine of required type '{plot.required_machine_type}' exists in fleet.",
                    "priority_score": score
                })
                continue

            # Work duration
            needed_duration = calculate_work_duration(plot.acres, eligible_equip[0].work_rate)

            # Try to schedule on each available day within or as close as possible to the window
            # Range: from max(reference_date, plot.window_start) to plot.window_end
            candidate_days = []
            curr = max(reference_date, plot.window_start)
            while curr <= plot.window_end:
                candidate_days.append(curr)
                curr += timedelta(days=1)

            if not candidate_days:
                unfulfilled.append({
                    "plot": plot,
                    "reason": f"Agronomic window ({plot.window_start} to {plot.window_end}) has already expired relative to simulation date ({reference_date}).",
                    "priority_score": score
                })
                continue

            # Iterate through days and machines
            best_placement = None
            min_added_travel = float("inf")

            for day in candidate_days:
                day_str = day.strftime("%Y-%m-%d")

                # Check weather block
                if day_str in self.weather_blocks:
                    rejection_reasons.append(f"Date {day_str} blocked by weather: {self.weather_blocks[day_str]}")
                    continue

                for eq in eligible_equip:
                    # Check breakdown block
                    if eq.id in self.equipment_breakdowns:
                        bd = self.equipment_breakdowns[eq.id]
                        if bd["start"] <= day <= bd["end"]:
                            rejection_reasons.append(f"{eq.name} down for repair on {day_str}: {bd['reason']}")
                            continue

                    # Check existing bookings for this machine on this day
                    day_bookings = [s for s in machine_schedules[eq.id] if s.day_date == day]
                    day_bookings.sort(key=lambda s: s.start_hour)

                    # Determine machine starting position on this day
                    if not day_bookings:
                        prev_lat = eq.lat
                        prev_lon = eq.lon
                        prev_loc_name = f"{eq.location_name} (Hub)"
                        earliest_start = DAY_START
                    else:
                        last_booking = day_bookings[-1]
                        prev_lat = last_booking.plot.lat
                        prev_lon = last_booking.plot.lon
                        prev_loc_name = f"Plot {last_booking.plot.village} ({last_booking.plot.farmer_name})"
                        earliest_start = last_booking.end_hour

                    # Calculate travel from prev location to this plot
                    dist_km = haversine_distance(prev_lat, prev_lon, plot.lat, plot.lon)
                    travel_hrs = calculate_travel_time(dist_km, eq.type)

                    req_start = round(earliest_start + travel_hrs, 2)
                    req_end = round(req_start + needed_duration, 2)

                    if req_end <= DAY_END:
                        # Feasible slot found!
                        if dist_km < min_added_travel:
                            min_added_travel = dist_km
                            best_placement = {
                                "equipment": eq,
                                "day_str": day_str,
                                "day_date": day,
                                "start_hour": req_start,
                                "end_hour": req_end,
                                "travel_hrs": travel_hrs,
                                "dist_km": dist_km,
                                "prev_loc": prev_loc_name
                            }
                            # If zero travel (same village) and inside window, immediate pick
                            if dist_km < 3.0:
                                break
                if best_placement and min_added_travel < 5.0:
                    break

            if best_placement:
                # Create confirmed slot
                eq = best_placement["equipment"]
                expl = (
                    f"Scheduled {eq.name} for {plot.farmer_name} on {best_placement['day_str']} "
                    f"from {self._format_hour(best_placement['start_hour'])} to {self._format_hour(best_placement['end_hour'])}. "
                    f"Includes {best_placement['travel_hrs']*60:.0f}m travel buffer ({best_placement['dist_km']} km from {best_placement['prev_loc']}). "
                    f"Rationale: {priority_expl}"
                )
                slot = BookingSlot(
                    booking_id=f"BK-{plot.id}-{eq.id}",
                    plot=plot,
                    equipment=eq,
                    day_str=best_placement["day_str"],
                    start_hour=best_placement["start_hour"],
                    end_hour=best_placement["end_hour"],
                    travel_from_prev_hours=best_placement["travel_hrs"],
                    travel_distance_km=best_placement["dist_km"],
                    prev_location=best_placement["prev_loc"],
                    priority_score=score,
                    explanation=expl
                )
                machine_schedules[eq.id].append(slot)
                assigned_slots.append(slot)
                assigned = True
            else:
                unfulfilled.append({
                    "plot": plot,
                    "reason": "; ".join(rejection_reasons) if rejection_reasons else "All machine working hours and travel windows exhausted within target agronomic window.",
                    "priority_score": score
                })

        return {
            "assigned_slots": assigned_slots,
            "unfulfilled": unfulfilled,
            "machine_schedules": machine_schedules
        }

    def reschedule_on_disruption(self, base_slots: List[BookingSlot]) -> Dict[str, Any]:
        """
        Dynamically reschedule when weather blocks or machine breakdowns occur.
        - Identifies impacted bookings.
        - Preserves unaffected bookings to minimize ripple disruption.
        - Reassigns affected bookings based on deadline priority.
        - Flags at-risk bookings.
        """
        unaffected_slots = []
        impacted_slots = []
        notifications = []

        # 1. Triage: Separate unaffected vs impacted
        for slot in base_slots:
            is_impacted = False
            impact_reason = ""

            # Check weather
            if slot.day_str in self.weather_blocks:
                is_impacted = True
                impact_reason = f"Weather Block: {self.weather_blocks[slot.day_str]} on {slot.day_str}"

            # Check breakdown
            if slot.equipment.id in self.equipment_breakdowns:
                bd = self.equipment_breakdowns[slot.equipment.id]
                if bd["start"] <= slot.day_date <= bd["end"]:
                    is_impacted = True
                    impact_reason = f"Breakdown of {slot.equipment.name}: {bd['reason']} until {bd['end']}"

            if is_impacted:
                impacted_slots.append((slot, impact_reason))
            else:
                unaffected_slots.append(slot)

        # 2. Sort impacted bookings by deadline urgency
        impacted_slots.sort(key=lambda x: (x[0].plot.window_end, -x[0].priority_score))

        # 3. Try to reschedule impacted bookings onto available slots
        new_slots = list(unaffected_slots) # preserve unaffected
        rescheduled_results = []
        at_risk_bookings = []

        # Create quick schedule map for slot checking
        for orig_slot, reason in impacted_slots:
            plot = orig_slot.plot
            reassigned = False

            # Eligible alternate equipment
            eligible_equip = [
                e for e in self.equipment_list
                if e.type == plot.required_machine_type or plot.required_machine_type in e.name
            ]

            # Try subsequent days up to deadline + 2 days (to catch at-risk)
            curr = max(self.start_date, plot.window_start)
            max_search_date = plot.window_end + timedelta(days=2)

            while curr <= max_search_date and not reassigned:
                curr_str = curr.strftime("%Y-%m-%d")

                if curr_str in self.weather_blocks:
                    curr += timedelta(days=1)
                    continue

                for eq in eligible_equip:
                    if eq.id in self.equipment_breakdowns:
                        bd = self.equipment_breakdowns[eq.id]
                        if bd["start"] <= curr <= bd["end"]:
                            continue

                    # Check daily slots already committed to this eq on this day
                    day_committed = [s for s in new_slots if s.equipment.id == eq.id and s.day_date == curr]
                    day_committed.sort(key=lambda s: s.start_hour)

                    duration = calculate_work_duration(plot.acres, eq.work_rate)

                    if not day_committed:
                        prev_lat, prev_lon = eq.lat, eq.lon
                        prev_name = f"{eq.location_name} (Hub)"
                        start_h = 7.0
                    else:
                        last_s = day_committed[-1]
                        prev_lat, prev_lon = last_s.plot.lat, last_s.plot.lon
                        prev_name = f"Plot {last_s.plot.village} ({last_s.plot.farmer_name})"
                        start_h = last_s.end_hour

                    dist_km = haversine_distance(prev_lat, prev_lon, plot.lat, plot.lon)
                    travel_h = calculate_travel_time(dist_km, eq.type)

                    cand_start = round(start_h + travel_h, 2)
                    cand_end = round(cand_start + duration, 2)

                    if cand_end <= 18.5:
                        # Found spot!
                        is_overdue = curr > plot.window_end
                        status_label = "Rescheduled (At-Risk)" if is_overdue else "Rescheduled (On-Time)"
                        
                        expl = (
                            f"Disruption Re-optimization: Shifted from original slot due to: {reason}. "
                            f"Reassigned to {eq.name} on {curr_str} ({self._format_hour(cand_start)} - {self._format_hour(cand_end)}). "
                            f"Buffer: {travel_h*60:.0f}m travel ({dist_km} km from {prev_name}). "
                        )
                        if is_overdue:
                            overdue_days = (curr - plot.window_end).days
                            expl += f"⚠️ WARNING: Exceeds agronomic window by {overdue_days} day(s). High yield monitoring recommended."

                        rescheduled_slot = BookingSlot(
                            booking_id=f"RESCHED-{orig_slot.booking_id}",
                            plot=plot,
                            equipment=eq,
                            day_str=curr_str,
                            start_hour=cand_start,
                            end_hour=cand_end,
                            travel_from_prev_hours=travel_h,
                            travel_distance_km=dist_km,
                            prev_location=prev_name,
                            priority_score=orig_slot.priority_score,
                            explanation=expl
                        )
                        rescheduled_slot.status = "Rescheduled"
                        new_slots.append(rescheduled_slot)
                        rescheduled_results.append(rescheduled_slot)

                        notif = {
                            "farmer": plot.farmer_name,
                            "phone": plot.phone,
                            "crop": plot.crop,
                            "operation": plot.operation,
                            "original_date": orig_slot.day_str,
                            "new_date": curr_str,
                            "new_time": f"{self._format_hour(cand_start)} - {self._format_hour(cand_end)}",
                            "machine": eq.name,
                            "reason": reason,
                            "is_at_risk": is_overdue,
                            "explanation": expl,
                            "sms_text": (
                                f"Kisan {plot.farmer_name}: Disruption update! Due to '{reason}', "
                                f"your {plot.crop} {plot.operation} is rescheduled to {curr_str} at "
                                f"{self._format_hour(cand_start)} with {eq.name}. "
                                f"Use AI Voice Assistant for instant voice rebooking."
                            )
                        }
                        notifications.append(notif)
                        if is_overdue:
                            at_risk_bookings.append(notif)

                        reassigned = True
                        break

                curr += timedelta(days=1)

            if not reassigned:
                notif = {
                    "farmer": plot.farmer_name,
                    "phone": plot.phone,
                    "crop": plot.crop,
                    "operation": plot.operation,
                    "original_date": orig_slot.day_str,
                    "new_date": "UNABLE TO RESCHEDULE",
                    "new_time": "N/A",
                    "machine": "N/A",
                    "reason": reason,
                    "is_at_risk": True,
                    "explanation": f"CRITICAL: All slots blocked or capacity exhausted following disruption ({reason}). AI Voice Assistant emergency contractor dispatch required.",
                    "sms_text": f"Kisan {plot.farmer_name}: URGENT. Machine could not be rescheduled within safe window after {reason}. Please speak to KrishiChakra AI Voice Assistant to book an emergency contractor."
                }
                notifications.append(notif)
                at_risk_bookings.append(notif)

        return {
            "all_slots": new_slots,
            "unaffected_count": len(unaffected_slots),
            "rescheduled_count": len(rescheduled_results),
            "at_risk_count": len(at_risk_bookings),
            "notifications": notifications,
            "at_risk_bookings": at_risk_bookings
        }

    def _format_hour(self, h: float) -> str:
        hours = int(h)
        minutes = int(round((h - hours) * 60))
        if minutes >= 60:
            hours += 1
            minutes = 0
        ampm = "AM" if hours < 12 else "PM"
        disp_h = hours if hours <= 12 else hours - 12
        if disp_h == 0:
            disp_h = 12
        return f"{disp_h:02d}:{minutes:02d} {ampm}"

    def audit_clashes(self, slots: List[BookingSlot]) -> List[Dict[str, Any]]:
        """
        Verify that no two bookings on the same machine overlap,
        AND that the travel buffer between them is strictly respected.
        Returns list of clash violations (empty list = zero clashes).
        """
        violations = []
        by_equip: Dict[str, Dict[str, List[BookingSlot]]] = {}
        for s in slots:
            by_equip.setdefault(s.equipment.id, {}).setdefault(s.day_str, []).append(s)

        for eq_id, days in by_equip.items():
            for d_str, day_slots in days.items():
                day_slots.sort(key=lambda s: s.start_hour)
                for i in range(len(day_slots) - 1):
                    curr_s = day_slots[i]
                    next_s = day_slots[i+1]

                    # Condition 1: Overlapping time intervals
                    if curr_s.end_hour > next_s.start_hour:
                        violations.append({
                            "type": "DIRECT_OVERLAP",
                            "equipment": curr_s.equipment.name,
                            "day": d_str,
                            "slot1": f"{curr_s.plot.farmer_name} ({curr_s.start_hour}-{curr_s.end_hour})",
                            "slot2": f"{next_s.plot.farmer_name} ({next_s.start_hour}-{next_s.end_hour})"
                        })

                    # Condition 2: Travel buffer violation
                    dist_km = haversine_distance(curr_s.plot.lat, curr_s.plot.lon, next_s.plot.lat, next_s.plot.lon)
                    min_buffer_hrs = calculate_travel_time(dist_km, curr_s.equipment.type)
                    gap_hrs = next_s.start_hour - curr_s.end_hour

                    # Allow slight rounding tolerance (0.01 hr ~ 36 secs)
                    if gap_hrs < min_buffer_hrs - 0.05:
                        violations.append({
                            "type": "TRAVEL_BUFFER_VIOLATED",
                            "equipment": curr_s.equipment.name,
                            "day": d_str,
                            "gap_hours": round(gap_hrs, 2),
                            "required_buffer": round(min_buffer_hrs, 2),
                            "distance_km": dist_km,
                            "from_plot": curr_s.plot.village,
                            "to_plot": next_s.plot.village
                        })

        return violations


# Run automated verification when executed directly
if __name__ == "__main__":
    print("=" * 70)
    print("  KRISHICHAKRA OPTIMIZER - ALGORITHMIC VERIFICATION & AUDIT SUITE")
    print("=" * 70)

    # 1. Setup realistic fleet
    equipment = [
        Equipment("EQ-01", "Mahindra 575 DI (Tractor)", "Tractor", 1.5, 850, "hour", "Rampur Central Hub", 28.6139, 77.2090, "Gurmeet Singh", "9876543210"),
        Equipment("EQ-02", "John Deere 5050D (Tractor)", "Tractor", 1.8, 950, "hour", "Sitapur Agro Center", 28.6350, 77.2250, "Harjit Singh", "9876543211"),
        Equipment("EQ-03", "Claas Crop Tiger 30 (Combine)", "Harvester", 2.5, 2200, "acre", "Kalyanpur Grain Yard", 28.5800, 77.2100, "Vikram Patel", "9876543212"),
        Equipment("EQ-04", "ASPEE Boom Sprayer (500L)", "Sprayer", 4.0, 450, "acre", "Shivpur Farm Depot", 28.6500, 77.1900, "Rohan Verma", "9876543213"),
    ]

    # 2. Setup realistic competing farmer requests
    plots = [
        Plot("PL-01", "Ramesh Kumar", "9811122201", "Rampur Village", 28.6180, 77.2150, 4.0, "Paddy", "Harvesting", "2026-11-18", "2026-11-19", "Harvester"),
        Plot("PL-02", "Suresh Patel", "9811122202", "Sitapur Village", 28.6400, 77.2300, 6.0, "Wheat", "Sowing", "2026-11-18", "2026-11-23", "Tractor"),
        Plot("PL-03", "Daler Singh", "9811122203", "Kalyanpur East", 28.5900, 77.2200, 5.0, "Paddy", "Harvesting", "2026-11-18", "2026-11-20", "Harvester"),
        Plot("PL-04", "Lakshmi Devi", "9811122204", "Shivpur South", 28.6450, 77.1850, 3.0, "Cotton", "Spraying", "2026-11-18", "2026-11-20", "Sprayer"),
        Plot("PL-05", "Balwinder Singh", "9811122205", "Rampur North", 28.6250, 77.2100, 8.0, "Paddy", "Harvesting", "2026-11-18", "2026-11-19", "Harvester"),
        Plot("PL-06", "Manpreet Kaur", "9811122206", "Sitapur West", 28.6300, 77.2150, 3.5, "Wheat", "Sowing", "2026-11-19", "2026-11-22", "Tractor"),
    ]

    sim_date = "2026-11-18"
    optimizer = ScheduleOptimizer(equipment, plots, sim_date)

    # -------------------------------------------------------------
    # TEST 1: Baseline Scheduling & Clash Audit
    # -------------------------------------------------------------
    print("\n[TEST 1] Running Baseline Global Schedule Optimization...")
    result = optimizer.optimize_schedule()
    assigned = result["assigned_slots"]
    unfulfilled = result["unfulfilled"]

    print(f" -> Assigned Operations: {len(assigned)}")
    print(f" -> Unfulfilled Requests: {len(unfulfilled)}")

    for slot in assigned:
        print(f"    * [{slot.day_str}] {slot.equipment.name} -> {slot.plot.farmer_name} ({slot.plot.crop} {slot.plot.operation}): {optimizer._format_hour(slot.start_hour)} - {optimizer._format_hour(slot.end_hour)} (Travel: {slot.travel_distance_km}km, buffer {slot.travel_from_prev_hours*60:.0f}m)")

    clashes = optimizer.audit_clashes(assigned)
    assert len(clashes) == 0, f"FAIL: Detected clashes in baseline schedule: {clashes}"
    print(" [PASS] Test 1: Zero double-booking, zero travel buffer clashes verified mathematically!")

    # -------------------------------------------------------------
    # TEST 2: Priority Rules Verification
    # -------------------------------------------------------------
    print("\n[TEST 2] Verifying Deadline-Based Priority Rules...")
    # Ramesh Kumar & Balwinder Singh both have tight Harvest deadlines (Nov 19)
    # Suresh Patel has Wheat Sowing with a relaxed deadline (Nov 23)
    p_balwinder = next(p for p in plots if p.farmer_name == "Balwinder Singh")
    p_suresh = next(p for p in plots if p.farmer_name == "Suresh Patel")
    score_b, expl_b = optimizer.calculate_priority(p_balwinder, datetime.strptime(sim_date, "%Y-%m-%d").date())
    score_s, expl_s = optimizer.calculate_priority(p_suresh, datetime.strptime(sim_date, "%Y-%m-%d").date())

    print(f" -> Balwinder Priority Score: {score_b:.1f} | Explanation: {expl_b}")
    print(f" -> Suresh Priority Score:    {score_s:.1f} | Explanation: {expl_s}")
    assert score_b > score_s, f"FAIL: Balwinder (deadline Nov 19) should have higher priority than Suresh (deadline Nov 23)"
    print(" [PASS] Test 2: Urgent deadline plots strictly outrank flexible plots!")

    # -------------------------------------------------------------
    # TEST 3: Weather Disruption & Dynamic Rescheduling
    # -------------------------------------------------------------
    print("\n[TEST 3] Injecting Heavy Monsoon Rain on 2026-11-19 (Soil unworkable)...")
    optimizer.add_weather_block("2026-11-19", "Continuous Heavy Rain (48mm) - Severe Waterlogging")
    resched_result = optimizer.reschedule_on_disruption(assigned)

    print(f" -> Unaffected Bookings Preserved: {resched_result['unaffected_count']}")
    print(f" -> Bookings Successfully Rescheduled: {resched_result['rescheduled_count']}")
    print(f" -> Critical At-Risk Flags: {resched_result['at_risk_count']}")
    print("\n Generated Notifications with Plain-Language Explanations:")
    for notif in resched_result["notifications"]:
        print(f"    * To {notif['farmer']} ({notif['phone']}):")
        print(f"      Status: {notif['original_date']} -> {notif['new_date']} ({notif['new_time']})")
        print(f"      SMS: \"{notif['sms_text']}\"")

    # Verify no booking is scheduled on the rain day
    rain_day_slots = [s for s in resched_result["all_slots"] if s.day_str == "2026-11-19"]
    assert len(rain_day_slots) == 0, f"FAIL: Found slots on weather blocked day: {rain_day_slots}"
    print(" [PASS] Test 3: Zero slots remain on rain-blocked day; unaffected slots preserved!")

    # -------------------------------------------------------------
    # TEST 4: Machine Breakdown Failover
    # -------------------------------------------------------------
    print("\n[TEST 4] Injecting Machine Breakdown on Mahindra 575 DI (EQ-01)...")
    optimizer.add_equipment_breakdown("EQ-01", "2026-11-18", "2026-11-20", "Hydraulic Lift Pump Failure")
    resched_result2 = optimizer.reschedule_on_disruption(assigned)
    broken_slots = [
        s for s in resched_result2["all_slots"]
        if s.equipment.id == "EQ-01" and s.day_date <= datetime.strptime("2026-11-20", "%Y-%m-%d").date()
    ]
    assert len(broken_slots) == 0, f"FAIL: Broken machine EQ-01 was assigned work during repair period!"
    print(" [PASS] Test 4: Broken machine safely isolated; bookings redirected to viable machines!")

    # -------------------------------------------------------------
    # TEST 5: Final Clash Audit after Rescheduling
    # -------------------------------------------------------------
    final_clashes = optimizer.audit_clashes(resched_result2["all_slots"])
    assert len(final_clashes) == 0, f"FAIL: Clashes detected after rescheduling: {final_clashes}"
    print(" [PASS] Test 5: Re-optimized schedule maintains 100% clash-free integrity with travel buffers!")

    print("\n" + "=" * 70)
    print("  ALL 5 OPTIMIZER & DISRUPTION TESTS PASSED WITH 100% ACCURACY!")
    print("=" * 70)
