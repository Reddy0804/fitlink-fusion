
import HealthTrackingForm from "@/components/health/HealthTrackingForm";
import HealthTips from "@/components/health/HealthTips";
import HealthInsightsPanel from "@/components/health/HealthInsightsPanel";
import AiHealthConsultant from "@/components/ai/AiHealthConsultant";

const HealthTracking = () => {
  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Health Tracking</h1>
        <p className="text-muted-foreground">
          Record your daily health metrics to receive personalized insights and recommendations.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HealthTrackingForm />
        </div>
        <div>
          <HealthInsightsPanel />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AiHealthConsultant />
        </div>
        <div>
          <HealthTips />
        </div>
      </div>
    </div>
  );
};

export default HealthTracking;
