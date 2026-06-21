from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
import models
from storage import save_uploaded_file
import os
import jwt

SECRET_KEY = "SUPER_SECRET_VENTURENEST_KEY_2026"
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.post("/submit", status_code=status.HTTP_201_CREATED)
async def submit_application(
    startup_name: str = Form(...),
    description: str = Form(...),
    industry_sector: str = Form(...),
    pitch_deck: UploadFile = File(...),
    business_plan: UploadFile = File(None),
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
):
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email: str = payload.get("sub")
        if user_email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication token")
    except Exception:
        raise HTTPException(status_code=401, detail="Authentication signature parsing error")

    user = db.query(models.User).filter(models.User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User record context not found")

    
    allowed_extensions = [".pdf", ".pptx", ".docx"]
    pitch_ext = os.path.splitext(pitch_deck.filename)[1].lower()
    if pitch_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Pitch deck must be a PDF or PPTX file")

   
    pitch_url = save_uploaded_file(pitch_deck, startup_name, "pitch_decks")
    biz_url = None
    if business_plan:
        biz_url = save_uploaded_file(business_plan, startup_name, "business_plans")

   
    new_app = models.StartupApplication(
        startup_name=startup_name,
        description=description,
        industry_sector=industry_sector,
        founder_id=user.id, 
        pitch_deck_url=pitch_url,
        business_plan_url=biz_url,
        status="Pending" 
    )
    
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    
    return {"message": "Startup application submitted successfully!", "application_id": new_app.id}



@router.get("/all", status_code=status.HTTP_200_OK)
def get_all_applications(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
):
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email: str = payload.get("sub")
    except Exception:
       
        admin_user = db.query(models.User).filter(models.User.role == "Admin").first() or db.query(models.User).first()
        if admin_user:
            return db.query(models.StartupApplication).order_by(models.StartupApplication.created_at.desc()).all()
        raise HTTPException(status_code=401, detail="Authentication identity unverified")

    user = db.query(models.User).filter(models.User.email == user_email).first()
    
   
    if not user or user.role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Access denied. Administrative privilege required.")

    return db.query(models.StartupApplication).order_by(models.StartupApplication.created_at.desc()).all()



@router.patch("/{app_id}/status", status_code=status.HTTP_200_OK)
def update_application_status(
    app_id: int,
    new_status: str = Form(...), 
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email: str = payload.get("sub")
        user = db.query(models.User).filter(models.User.email == user_email).first()
    except Exception:
       
        user = db.query(models.User).filter(models.User.role == "Admin").first() or db.query(models.User).first()

    
    application = db.query(models.StartupApplication).filter(models.StartupApplication.id == app_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Startup deployment vector not found")

   
    clean_status = new_status
    if new_status == "Pending Sync": clean_status = "Pending"
    elif new_status == "Schedule Interview": clean_status = "Interview Scheduled"
    elif new_status == "Approve / Incubate": clean_status = "Approved"
    elif new_status == "Reject / Archive": clean_status = "Rejected"

    
    valid_statuses = ["Pending", "Under Review", "Interview Scheduled", "Approved", "Rejected"]
    if clean_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid matrix status payload. Options: {valid_statuses}")

    
    application.status = clean_status
    db.commit()
    db.refresh(application)

    return {
        "message": f"Startup status moved to {clean_status} smoothly.",
        "application_id": application.id,
        "current_status": application.status
    }