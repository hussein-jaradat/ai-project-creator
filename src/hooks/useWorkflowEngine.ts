import { useReducer, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';
import {
  WorkflowState,
  WorkflowAction,
  WorkflowStage,
  CampaignBrief,
  CreativeStrategy,
  GeneratedAsset,
  Caption,
  GenerationJob,
  ExportPackage,
  EnergyLevel,
  STAGE_REQUIREMENTS,
  STAGE_ORDER,
} from '@/types/workflow';

const initialState: WorkflowState = {
  stage: 'brief',
  workspaceId: null,
  projectId: null,
  campaignId: null,
  brandKitId: null,
  brief: {},
  strategies: [],
  selectedStrategy: null,
  jobs: [],
  assets: [],
  captions: [],
  exports: [],
  referenceImages: [],
  isLoading: false,
  error: null,
};

function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case 'SET_STAGE':
      return { ...state, stage: action.payload };
    
    case 'SET_CONTEXT':
      return { ...state, ...action.payload };
    
    case 'UPDATE_BRIEF':
      return { ...state, brief: { ...state.brief, ...action.payload } };
    
    case 'SET_STRATEGIES':
      return { ...state, strategies: action.payload };
    
    case 'SELECT_STRATEGY':
      return {
        ...state,
        strategies: state.strategies.map(s => ({ ...s, isSelected: s.id === action.payload })),
        selectedStrategy: state.strategies.find(s => s.id === action.payload) || null,
      };
    
    case 'ADD_JOB':
      return { ...state, jobs: [...state.jobs, action.payload] };
    
    case 'UPDATE_JOB':
      return {
        ...state,
        jobs: state.jobs.map(j =>
          j.id === action.payload.id ? { ...j, ...action.payload.updates } : j
        ),
      };
    
    case 'ADD_ASSET':
      return { ...state, assets: [...state.assets, action.payload] };
    
    case 'UPDATE_ASSET':
      return {
        ...state,
        assets: state.assets.map(a =>
          a.id === action.payload.id ? { ...a, ...action.payload.updates } : a
        ),
      };
    
    case 'ADD_CAPTION':
      return { ...state, captions: [...state.captions, action.payload] };
    
    case 'SELECT_CAPTION':
      return {
        ...state,
        captions: state.captions.map(c => ({
          ...c,
          isSelected: c.id === action.payload.captionId,
        })),
      };
    
    case 'ADD_EXPORT':
      return { ...state, exports: [...state.exports, action.payload] };
    
    case 'SET_REFERENCE_IMAGES':
      return { ...state, referenceImages: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

export function useWorkflowEngine() {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  // Stage navigation
  const canAdvance = useCallback(() => {
    return STAGE_REQUIREMENTS[state.stage](state);
  }, [state]);

  const advanceStage = useCallback(() => {
    const currentIndex = STAGE_ORDER.indexOf(state.stage);
    if (currentIndex < STAGE_ORDER.length - 1 && canAdvance()) {
      dispatch({ type: 'SET_STAGE', payload: STAGE_ORDER[currentIndex + 1] });
      return true;
    }
    return false;
  }, [state.stage, canAdvance]);

  const goToStage = useCallback((stage: WorkflowStage) => {
    dispatch({ type: 'SET_STAGE', payload: stage });
  }, []);

  const previousStage = useCallback(() => {
    const currentIndex = STAGE_ORDER.indexOf(state.stage);
    if (currentIndex > 0) {
      dispatch({ type: 'SET_STAGE', payload: STAGE_ORDER[currentIndex - 1] });
    }
  }, [state.stage]);

  // Brief management
  const updateBrief = useCallback((data: Partial<CampaignBrief>) => {
    dispatch({ type: 'UPDATE_BRIEF', payload: data });
  }, []);

  // Strategy management
  const setStrategies = useCallback((strategies: CreativeStrategy[]) => {
    dispatch({ type: 'SET_STRATEGIES', payload: strategies });
  }, []);

  const selectStrategy = useCallback((strategyId: string) => {
    dispatch({ type: 'SELECT_STRATEGY', payload: strategyId });
  }, []);

  // Asset management
  const addAsset = useCallback((asset: GeneratedAsset) => {
    dispatch({ type: 'ADD_ASSET', payload: asset });
  }, []);

  const updateAsset = useCallback((id: string, updates: Partial<GeneratedAsset>) => {
    dispatch({ type: 'UPDATE_ASSET', payload: { id, updates } });
  }, []);

  const approveAsset = useCallback((id: string) => {
    dispatch({ type: 'UPDATE_ASSET', payload: { id, updates: { isApproved: true } } });
  }, []);

  const favoriteAsset = useCallback((id: string, isFavorite: boolean) => {
    dispatch({ type: 'UPDATE_ASSET', payload: { id, updates: { isFavorite } } });
  }, []);

  // Job management
  const addJob = useCallback((job: GenerationJob) => {
    dispatch({ type: 'ADD_JOB', payload: job });
  }, []);

  const updateJob = useCallback((id: string, updates: Partial<GenerationJob>) => {
    dispatch({ type: 'UPDATE_JOB', payload: { id, updates } });
  }, []);

  // Caption management
  const addCaption = useCallback((caption: Caption) => {
    dispatch({ type: 'ADD_CAPTION', payload: caption });
  }, []);

  const selectCaption = useCallback((assetId: string, captionId: string) => {
    dispatch({ type: 'SELECT_CAPTION', payload: { assetId, captionId } });
  }, []);

  // Export management
  const addExport = useCallback((exportPackage: ExportPackage) => {
    dispatch({ type: 'ADD_EXPORT', payload: exportPackage });
  }, []);

  // Reference images
  const setReferenceImages = useCallback((images: string[]) => {
    dispatch({ type: 'SET_REFERENCE_IMAGES', payload: images });
  }, []);

  // Context management
  const setContext = useCallback((context: { 
    workspaceId?: string; 
    projectId?: string; 
    campaignId?: string;
    brandKitId?: string;
  }) => {
    dispatch({ type: 'SET_CONTEXT', payload: context });
  }, []);

  // Loading and error
  const setLoading = useCallback((isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
    if (error) toast.error(error);
  }, []);

  // Reset workflow
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Save campaign to database
  const saveCampaign = useCallback(async () => {
    if (!state.workspaceId || !state.projectId) {
      setError('يجب تحديد مساحة العمل والمشروع أولاً');
      return null;
    }

    try {
      setLoading(true);

      if (state.campaignId) {
        // Update existing campaign
        const { error } = await supabase
          .from('campaigns')
          .update({
            brief: state.brief as Json,
            workflow_stage: state.stage,
            selected_strategy: state.selectedStrategy as unknown as Json,
          })
          .eq('id', state.campaignId);

        if (error) throw error;
        return state.campaignId;
      } else {
        // Create new campaign
        const { data, error } = await supabase
          .from('campaigns')
          .insert({
            project_id: state.projectId,
            name: state.brief.businessName || 'حملة جديدة',
            objective: state.brief.objective || 'awareness',
            target_audience: state.brief.targetAudience,
            platforms: state.brief.platforms || [],
            brief: state.brief,
            workflow_stage: state.stage,
            created_by: (await supabase.auth.getUser()).data.user?.id,
          })
          .select()
          .single();

        if (error) throw error;
        
        setContext({ campaignId: data.id });
        return data.id;
      }
    } catch (error) {
      console.error('Save campaign error:', error);
      setError('فشل في حفظ الحملة');
      return null;
    } finally {
      setLoading(false);
    }
  }, [state, setContext, setLoading, setError]);

  // Load campaign from database
  const loadCampaign = useCallback(async (campaignId: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          creative_strategies (*),
          assets (*),
          captions (*)
        `)
        .eq('id', campaignId)
        .single();

      if (error) throw error;

      // Restore state from database
      dispatch({ type: 'SET_CONTEXT', payload: { campaignId: data.id, projectId: data.project_id } });
      dispatch({ type: 'SET_STAGE', payload: data.workflow_stage as WorkflowStage });
      
      if (data.brief && typeof data.brief === 'object') {
        dispatch({ type: 'UPDATE_BRIEF', payload: data.brief as unknown as CampaignBrief });
      }
      
      if (data.creative_strategies) {
        dispatch({ type: 'SET_STRATEGIES', payload: data.creative_strategies.map((s: Record<string, unknown>) => ({
          id: s.id as string,
          title: s.title as string,
          visualStyle: s.visual_style as string,
          hookIdea: s.hook_idea as string,
          contentAngle: s.content_angle as string,
          exampleHeadline: s.example_headline as string,
          mood: s.mood as string,
          energyLevel: (s.energy_level as EnergyLevel) || 'moderate',
          aiReasoning: s.ai_reasoning as string,
          isSelected: s.is_selected as boolean,
        } as CreativeStrategy)) });
      }

      if (data.selected_strategy && typeof data.selected_strategy === 'object' && 'id' in data.selected_strategy) {
        dispatch({ type: 'SELECT_STRATEGY', payload: (data.selected_strategy as { id: string }).id });
      }

      return data;
    } catch (error) {
      console.error('Load campaign error:', error);
      setError('فشل في تحميل الحملة');
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Get stage progress
  const getProgress = useCallback(() => {
    const currentIndex = STAGE_ORDER.indexOf(state.stage);
    return ((currentIndex + 1) / STAGE_ORDER.length) * 100;
  }, [state.stage]);

  return {
    state,
    
    // Navigation
    canAdvance,
    advanceStage,
    goToStage,
    previousStage,
    getProgress,
    
    // Brief
    updateBrief,
    
    // Strategies
    setStrategies,
    selectStrategy,
    
    // Assets
    addAsset,
    updateAsset,
    approveAsset,
    favoriteAsset,
    
    // Jobs
    addJob,
    updateJob,
    
    // Captions
    addCaption,
    selectCaption,
    
    // Exports
    addExport,
    
    // Context
    setContext,
    setReferenceImages,
    
    // Persistence
    saveCampaign,
    loadCampaign,
    
    // Utils
    setLoading,
    setError,
    reset,
  };
}
