import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Search,
  Filter,
  Menu,
  X,
  ChevronRight,
  User,
  LogOut,
  Bell,
  Settings,
  Building2,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  Camera,
  Loader,
  Image,
} from "lucide-react";
import ProjectMap3D from "../components/ProjectMap3D.jsx";
import ProjectMap3DModel from "../components/ProjectMap3DModel.jsx";
import api from "../../axios.js";
import { initializePushNotifications } from "../utils/pushNotifications.js";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [geolocation, setGeolocation] = useState(null);
  const [isCapturingLocation, setIsCapturingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const notificationRef = useRef(null);

  const [showPhotosModal, setShowPhotosModal] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const response = await api.get('/api/notifications?limit=10');
      if (response.data.success) {
        setNotifications(response.data.data);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await api.put(`/api/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, is_read: true, read_at: new Date() }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/api/notifications/read-all');
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true, read_at: new Date() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      navigate('/');
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/api/projects');
        if (response.data.success) {
          setProjects(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
    fetchNotifications();
    initializePushNotifications(api).catch(error => {
      console.error('Error initializing push notifications:', error);
    });

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "finished":
        return "bg-green-100 text-green-700 border-green-300";
      case "ongoing":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "pending":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "finished":
        return <CheckCircle2 className="w-4 h-4" />;
      case "ongoing":
        return <Clock className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getDisplayStatus = (status) => {
    const statusMap = {
      'finished': 'completed',
      'ongoing': 'ongoing',
      'pending': 'planned',
      'cancelled': 'cancelled'
    };
    return statusMap[status] || status;
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.project_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.contractor_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (filterStatus === "all") {
      matchesFilter = true;
    } else if (filterStatus === "completed") {
      matchesFilter = project.status === "finished";
    } else {
      matchesFilter = project.status === filterStatus;
    }
    
    return matchesSearch && matchesFilter;
  });

  // Request camera access and start stream
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      setCameraStream(stream);
    } catch (error) {
      console.error('Error accessing camera:', error);
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraError('Camera permission denied. Please allow camera access and try again.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraError('No camera found. Please connect a camera and try again.');
      } else {
        setCameraError('Unable to access camera. Please grant camera permissions.');
      }
    }
  };

  // Get live geolocation
  const captureGeolocation = () => {
    setIsCapturingLocation(true);
    if (!navigator.geolocation) {
      setCameraError('Geolocation is not supported by your browser.');
      setIsCapturingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeolocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        });
        setIsCapturingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setCameraError('Unable to get your location. Please enable location permissions.');
        setIsCapturingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Open camera modal and request permissions
  const handleReportIssue = async () => {
    setShowCameraModal(true);
    setCapturedPhoto(null);
    setGeolocation(null);
    setCameraError(null);
    
    // Request camera and location permissions
    await startCamera();
    captureGeolocation();
  };

  // Capture photo from video stream
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedPhoto(photoDataUrl);
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  // Close camera modal and cleanup
  const closeCameraModal = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
    setCapturedPhoto(null);
    setGeolocation(null);
    setCameraError(null);
  };

  // Submit report with photo and geolocation
  const submitReport = async () => {
    if (!capturedPhoto || !geolocation || !selectedProject) {
      setCameraError('Please capture a photo and ensure location is available.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert base64 data URL to blob
      const base64Response = await fetch(capturedPhoto);
      const blob = await base64Response.blob();
      
      // Create FormData for multipart/form-data upload
      const formData = new FormData();
      formData.append('photo', blob, `report-${Date.now()}.jpg`);
      formData.append('projectId', selectedProject._id);
      formData.append('projectName', selectedProject.project_name);
      formData.append('latitude', geolocation.latitude.toString());
      formData.append('longitude', geolocation.longitude.toString());
      formData.append('accuracy', geolocation.accuracy ? geolocation.accuracy.toString() : '');
      formData.append('timestamp', geolocation.timestamp || new Date().toISOString());
      formData.append('reportType', 'issue');

      const submitResponse = await api.post('/api/projects/report-issue', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (submitResponse.data.success) {
        alert('Report submitted successfully! Thank you for your contribution.');
        closeCameraModal();
      } else {
        setCameraError('Failed to submit report. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setCameraError(error.response?.data?.error || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewPhotos = async () => {
    if (!selectedProject) return;
    
    setShowPhotosModal(true);
    setLoadingPhotos(true);
    setPhotos([]);
    setSelectedPhoto(null);
    
    try {
      const response = await api.get(`/api/projects/${selectedProject._id}/photos`);
      if (response.data.success) {
        const baseURL = api.defaults.baseURL || 'http://localhost:3000';
        const baseUrlClean = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
        const photosWithFullUrl = response.data.data.map(photo => ({
          ...photo,
          fullUrl: photo.url.startsWith('http') ? photo.url : `${baseUrlClean}${photo.url}`
        }));
        setPhotos(photosWithFullUrl);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoadingPhotos(false);
    }
  };

  const closePhotosModal = () => {
    setShowPhotosModal(false);
    setSelectedPhoto(null);
  };

  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
      });
    }
    
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header Navigation */}
      <header className="bg-white border-b border-gray-200 z-40 flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">BantayBayan</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) {
                    fetchNotifications();
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-brand-lg border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-brand-primary hover:text-brand-primary-dark font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  <div className="overflow-y-auto flex-1">
                    {loadingNotifications ? (
                      <div className="p-8 text-center">
                        <Loader className="w-6 h-6 animate-spin text-brand-primary mx-auto" />
                        <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No notifications</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                          <button
                            key={notification._id}
                            onClick={() => {
                              if (!notification.is_read) {
                                markNotificationAsRead(notification._id);
                              }
                              if (notification.project_id) {
                                const project = projects.find(p => p._id === notification.project_id?._id);
                                if (project) {
                                  setSelectedProject(project);
                                  setShowNotifications(false);
                                }
                              }
                            }}
                            className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                              !notification.is_read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                                !notification.is_read ? 'bg-brand-primary' : 'bg-transparent'
                              }`}></div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold mb-1 ${
                                  !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-600 line-clamp-2">
                                  {notification.message}
                                </p>
                                {notification.project_id && (
                                  <p className="text-xs text-brand-primary mt-1">
                                    {notification.project_id.project_name}
                                  </p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(notification.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                Juan Dela Cruz
              </span>
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-red-600"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Sidebar - Project List */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-full sm:w-96 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out`}
          style={{ top: "64px" }}
        >
          {/* Search and Filter */}
          <div className="p-4 border-b border-gray-200 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  filterStatus === "all"
                    ? "bg-brand-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({projects.length || 0})
              </button>
              <button
                onClick={() => setFilterStatus("ongoing")}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  filterStatus === "ongoing"
                    ? "bg-brand-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Ongoing
              </button>
              <button
                onClick={() => setFilterStatus("completed")}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  filterStatus === "completed"
                    ? "bg-brand-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilterStatus("pending")}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  filterStatus === "pending"
                    ? "bg-brand-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pending
              </button>
            </div>
          </div>

          {/* Project List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 space-y-2">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading projects...</div>
              ) : filteredProjects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No projects found</div>
              ) : (
                filteredProjects.map((project) => (
                  <button
                    key={project._id}
                    onClick={() => setSelectedProject(project)}
                    className={`w-full text-left p-4 rounded-lg border transition-all hover:shadow-md ${
                      selectedProject?._id === project._id
                        ? "border-brand-primary bg-blue-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                        {project.project_name}
                      </h3>
                      <ChevronRight
                        className={`w-5 h-5 flex-shrink-0 transition-transform ${
                          selectedProject?._id === project._id
                            ? "text-brand-primary"
                            : "text-gray-400"
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="line-clamp-1">{project.region} • {project.legislative_district}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {getStatusIcon(project.status)}
                        <span className="capitalize">{getDisplayStatus(project.status)}</span>
                      </span>
                      {project.is_flagged && (
                        <span className="text-xs font-semibold text-red-600">⚠️ Flagged</span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Right Side - Map and Project Details */}
        <main className="flex-1 flex flex-col overflow-hidden min-h-0 relative">
          {/* Map Container */}
          <div className="absolute inset-0 bg-gray-100">
            <ProjectMap3D 
              projects={projects} 
              selectedProject={selectedProject}
              onProjectSelect={setSelectedProject}
              loading={loading}
            />
          </div>

          {/* Project Details Panel */}
          {selectedProject && (
            <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm z-50">
              <div className="bg-white rounded-xl shadow-brand-lg w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
                <div className="flex items-start justify-between p-5 border-b border-gray-200 flex-shrink-0">
                  <h2 className="text-xl font-bold text-gray-900 pr-8">
                    {selectedProject.project_name}
                  </h2>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                  <div className="flex-1 p-5 overflow-y-auto">
                    <div className="space-y-5">
                      {/* Key Information Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500">Location</p>
                          <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-brand-primary" />
                            {selectedProject.region} • {selectedProject.legislative_district}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500">Status</p>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusColor(
                              selectedProject.status
                            )}`}
                          >
                            {getStatusIcon(selectedProject.status)}
                            <span className="capitalize">{getDisplayStatus(selectedProject.status)}</span>
                          </span>
                        </div>
                        {selectedProject.risk_score !== undefined && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500">Risk Score</p>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-semibold ${
                              selectedProject.risk_score > 70 ? 'bg-red-100 text-red-800' :
                              selectedProject.risk_score > 40 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              <AlertCircle className="w-4 h-4" />
                              {selectedProject.risk_score}
                            </span>
                          </div>
                        )}
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500">Budget</p>
                          <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4 text-brand-primary" />
                            ₱{selectedProject.approved_budget?.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Project Details Section */}
                      <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Project Details</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500">Type of Work</p>
                            <p className="text-sm text-gray-900">{selectedProject.type_of_work}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500">Infrastructure Type</p>
                            <p className="text-sm text-gray-900">{selectedProject.infrastructure_type}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500">Project ID</p>
                            <p className="text-sm text-gray-900 font-mono">{selectedProject.project_id}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500">Contract ID</p>
                            <p className="text-sm text-gray-900 font-mono">{selectedProject.contract_id}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500">Timeline</p>
                            <p className="text-sm text-gray-900 flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-brand-primary" />
                              {new Date(selectedProject.start_date).toLocaleDateString()}
                              {selectedProject.completion_date_actual && (
                                <> - {new Date(selectedProject.completion_date_actual).toLocaleDateString()}</>
                              )}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500">Funding Year</p>
                            <p className="text-sm text-gray-900">{selectedProject.funding_year}</p>
                          </div>
                        </div>
                      </div>

                      {/* Financial Information */}
                      <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Financial Information</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500">Contract Cost</p>
                            <p className="text-sm font-semibold text-gray-900">
                              ₱{selectedProject.contract_cost?.toLocaleString()}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500">District Engineering Office</p>
                            <p className="text-sm text-gray-900">{selectedProject.district_engineering_office}</p>
                          </div>
                        </div>
                      </div>

                      {/* Contractor Information */}
                      <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Contractor</h3>
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500">Contractor Name</p>
                            <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                              <Building2 className="w-4 h-4 text-brand-primary" />
                              {selectedProject.contractor_name}
                            </p>
                          </div>
                          {selectedProject.contractor_id && typeof selectedProject.contractor_id === 'object' && (
                            <div className="grid grid-cols-2 gap-3">
                              {selectedProject.contractor_id.credit_score !== undefined && (
                                <div className="space-y-1">
                                  <p className="text-xs text-gray-500">Credit Score</p>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {selectedProject.contractor_id.credit_score}
                                  </p>
                                </div>
                              )}
                              {selectedProject.contractor_id.success_rate !== undefined && (
                                <div className="space-y-1">
                                  <p className="text-xs text-gray-500">Success Rate</p>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {selectedProject.contractor_id.success_rate}%
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {selectedProject.is_flagged && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800 font-semibold flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Flagged for Inspection
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2 border-t border-gray-200">
                        <button 
                          onClick={handleReportIssue}
                          className="flex-1 bg-brand-gradient text-white py-2.5 rounded-lg font-semibold text-sm hover:shadow-brand-lg transition-all flex items-center justify-center gap-2"
                        >
                          <Camera className="w-4 h-4" />
                          Report Issue
                        </button>
                        <button 
                          onClick={handleViewPhotos}
                          className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                        >
                          <Image className="w-4 h-4" />
                          View Photos
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="w-1/2 border-l border-gray-200 flex-shrink-0">
                    <div className="h-full">
                      <ProjectMap3DModel project={selectedProject} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Camera Modal for Reporting Issues */}
          {showCameraModal && (
            <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm z-[60]">
              <div className="bg-white rounded-xl shadow-brand-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Report Issue</h3>
                  <button
                    onClick={closeCameraModal}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                  {cameraError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">{cameraError}</p>
                    </div>
                  )}

                  {!capturedPhoto ? (
                    <div className="space-y-4">
                      <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                        {cameraStream ? (
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                            onLoadedMetadata={() => {
                              if (videoRef.current) {
                                videoRef.current.play().catch(err => {
                                  console.error('Error playing video on load:', err);
                                });
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white">
                            <div className="text-center">
                              <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">Requesting camera access...</p>
                            </div>
                          </div>
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          {geolocation ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <MapPin className="w-4 h-4" />
                              <span>Location captured</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-gray-500">
                              {isCapturingLocation ? (
                                <>
                                  <Loader className="w-4 h-4 animate-spin" />
                                  <span>Capturing location...</span>
                                </>
                              ) : (
                                <>
                                  <MapPin className="w-4 h-4" />
                                  <span>Waiting for location...</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        {geolocation && (
                          <p className="text-xs text-gray-600">
                            Lat: {geolocation.latitude.toFixed(6)}, Lng: {geolocation.longitude.toFixed(6)}
                            <br />
                            Accuracy: ±{Math.round(geolocation.accuracy)}m
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={capturePhoto}
                          disabled={!cameraStream || !geolocation}
                          className="flex-1 bg-brand-gradient text-white py-3 rounded-lg font-semibold text-sm hover:shadow-brand-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <Camera className="w-4 h-4" />
                          Capture Photo
                        </button>
                        <button
                          onClick={captureGeolocation}
                          disabled={isCapturingLocation}
                          className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isCapturingLocation ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <MapPin className="w-4 h-4" />
                          )}
                          Refresh Location
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                        <img
                          src={capturedPhoto}
                          alt="Captured report"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <MapPin className="w-4 h-4" />
                          <span>Location: {geolocation.latitude.toFixed(6)}, {geolocation.longitude.toFixed(6)}</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Project: {selectedProject?.project_name}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={retakePhoto}
                          disabled={isSubmitting}
                          className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-all disabled:opacity-50"
                        >
                          Retake Photo
                        </button>
                        <button
                          onClick={submitReport}
                          disabled={isSubmitting || !geolocation}
                          className="flex-1 bg-brand-gradient text-white py-3 rounded-lg font-semibold text-sm hover:shadow-brand-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader className="w-4 h-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            'Submit Report'
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {showPhotosModal && (
            <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm z-[60]">
              <div className="bg-white rounded-xl shadow-brand-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                  <h3 className="text-lg font-bold text-gray-900">
                    Project Photos
                  </h3>
                  <button
                    onClick={closePhotosModal}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {loadingPhotos ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader className="w-6 h-6 animate-spin text-brand-primary" />
                      <span className="ml-2 text-gray-600">Loading photos...</span>
                    </div>
                  ) : photos.length === 0 ? (
                    <div className="text-center py-12">
                      <Image className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">No photos available for this project</p>
                    </div>
                  ) : selectedPhoto ? (
                    <div className="space-y-4">
                      <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                        <img
                          src={selectedPhoto.fullUrl}
                          alt="Project photo"
                          className="w-full h-full object-contain"
                        />
                        <button
                          onClick={() => setSelectedPhoto(null)}
                          className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-700" />
                        </button>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-gray-700">Type:</span>
                          <span className="text-gray-600 capitalize">{selectedPhoto.type === 'report' ? 'Issue Report' : 'Progress Photo'}</span>
                        </div>
                        {selectedPhoto.report_type && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-gray-700">Report Type:</span>
                            <span className="text-gray-600 capitalize">{selectedPhoto.report_type}</span>
                          </div>
                        )}
                        {selectedPhoto.status && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-gray-700">Status:</span>
                            <span className={`capitalize ${
                              selectedPhoto.status === 'verified' ? 'text-green-600' :
                              selectedPhoto.status === 'pending' ? 'text-yellow-600' :
                              selectedPhoto.status === 'rejected' ? 'text-red-600' :
                              'text-gray-600'
                            }`}>
                              {selectedPhoto.status}
                            </span>
                          </div>
                        )}
                        {selectedPhoto.date && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">
                              {new Date(selectedPhoto.date).toLocaleString()}
                            </span>
                          </div>
                        )}
                        {(selectedPhoto.latitude && selectedPhoto.longitude) && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">
                              {selectedPhoto.latitude.toFixed(6)}, {selectedPhoto.longitude.toFixed(6)}
                            </span>
                            {selectedPhoto.accuracy && (
                              <span className="text-gray-500 text-xs">
                                (±{Math.round(selectedPhoto.accuracy)}m)
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {photos.map((photo, index) => (
                        <div
                          key={photo.id || index}
                          className="relative group cursor-pointer"
                          onClick={() => setSelectedPhoto(photo)}
                        >
                          <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                            <img
                              src={photo.fullUrl}
                              alt={`Project photo ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
                              }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <Image className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                              <div className="flex items-center justify-between">
                                <span className="capitalize">{photo.type === 'report' ? 'Report' : 'Progress'}</span>
                                {photo.date && (
                                  <span className="text-gray-300">
                                    {new Date(photo.date).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
