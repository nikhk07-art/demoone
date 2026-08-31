/**
 * Membership Business Network — Google Apps Script REST API Layer
 * Implements doGet(e) and doPost(e) with CORS, authentication verification,
 * and routing to modular handlers.
 */

function doGet(e) {
  try {
    const action = e && e.parameter ? e.parameter.action : 'getDashboard';
    const params = (e && e.parameter) || {};
    let resultData = {};

    switch (action) {
      case 'getDashboard':
        resultData = getDashboard(params);
        break;
      case 'getMembers':
        resultData = getMembers(params);
        break;
      case 'getMember':
        resultData = getMember(params.member_id);
        break;
      case 'getCategories':
        resultData = getCategories(params);
        break;
      case 'getChapters':
        resultData = getChapters(params);
        break;
      case 'getPosts':
        resultData = getPosts(params);
        break;
      case 'getEvents':
        resultData = getEvents(params);
        break;
      case 'getVisitors':
        resultData = getVisitors(params);
        break;
      case 'getReferrals':
        resultData = getReferrals(params);
        break;
      case 'getBusinessTransactions':
        resultData = getBusinessTransactions(params);
        break;
      case 'getNotifications':
        resultData = getNotifications(params);
        break;
      case 'getTrainings':
        resultData = getTrainings(params);
        break;
      case 'getAnnouncements':
        resultData = getAnnouncements(params);
        break;
      case 'getOrganizationSettings':
        resultData = getOrganizationSettings();
        break;
      case 'getActivityLog':
        resultData = getActivityLog(params);
        break;
      case 'getSheetTabs':
        resultData = getSheetTabs();
        break;
      default:
        return createJsonResponse(false, 'Unknown GET action: ' + action, null);
    }

    return createJsonResponse(true, 'Operation completed successfully', resultData);
  } catch (error) {
    return createJsonResponse(false, error.message || String(error), null);
  }
}

function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const action = payload.action;
    let resultData = {};

    switch (action) {
      case 'createMember':
        resultData = createMember(payload.data || payload, payload.user_id);
        break;
      case 'updateMember':
        resultData = updateMember(payload.data || payload, payload.user_id);
        break;
      case 'approveMember':
        resultData = approveMember(payload.member_id, payload.approved_by, payload.notes);
        break;
      case 'rejectMember':
        resultData = rejectMember(payload.member_id, payload.rejected_by, payload.reason);
        break;
      case 'createPost':
        resultData = createPost(payload.data || payload);
        break;
      case 'createComment':
        resultData = createComment(payload.data || payload);
        break;
      case 'toggleLike':
        resultData = toggleLike(payload.post_id, payload.member_id, payload.reaction_type);
        break;
      case 'createAnnouncement':
        resultData = createAnnouncement(payload.data || payload);
        break;
      case 'createEvent':
        resultData = createEvent(payload.data || payload);
        break;
      case 'markAttendance':
        resultData = markAttendance(payload.event_id, payload.attendances, payload.marked_by);
        break;
      case 'createVisitor':
        resultData = createVisitor(payload.data || payload);
        break;
      case 'convertVisitor':
        resultData = convertVisitor(payload.visitor_id, payload.memberData, payload.converted_by);
        break;
      case 'createReferral':
        resultData = createReferral(payload.data || payload);
        break;
      case 'updateReferralStatus':
        resultData = updateReferralStatus(
          payload.referral_id,
          payload.status,
          payload.closed_business_value,
          payload.closure_date,
          payload.updated_by
        );
        break;
      case 'createBusinessTransaction':
        resultData = createBusinessTransaction(payload.data || payload);
        break;
      case 'createTraining':
        resultData = createTraining(payload.data || payload);
        break;
      case 'createNotification':
        resultData = createNotification(payload.data || payload);
        break;
      case 'uploadFileToDrive':
        resultData = uploadFileToDrive(
          payload.base64Data,
          payload.fileName,
          payload.mimeType,
          payload.subFolder
        );
        break;
      default:
        return createJsonResponse(false, 'Unknown POST action: ' + action, null);
    }

    return createJsonResponse(true, 'Operation completed successfully', resultData);
  } catch (error) {
    return createJsonResponse(false, error.message || String(error), null);
  }
}
