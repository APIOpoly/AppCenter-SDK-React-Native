#import "RNWrapperCrashesHelper.h"
#import "RNCrashesUtils.h"
#import <MobileCenterCrashes/MSWrapperCrashesHelper.h>

// Support React Native headers both in the React namespace, where they are in RN version 0.40+,
// and no namespace, for older versions of React Native
#if __has_include(<React/RCTAssert.h>)
#import <React/RCTAssert.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTRootView.h>
#import <React/RCTUtils.h>
#else
#import "RCTAssert.h"
#import "RCTBridgeModule.h"
#import "RCTConvert.h"
#import "RCTEventDispatcher.h"
#import "RCTRootView.h"
#import "RCTUtils.h"
#endif

@interface RNWrapperCrashesHelper () <RCTBridgeModule>

@end

@implementation RNWrapperCrashesHelper

RCT_EXPORT_MODULE();

+ (void)setAutomaticProcessing:(BOOL)automaticProcessing;
{
  [MSWrapperCrashesHelper setAutomaticProcessing:automaticProcessing];
}

/**
 * Gets a list of unprocessed crash reports.
 */
RCT_EXPORT_METHOD(getUnprocessedCrashReports:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  void (^fetchUnprocessedCrashReports)() = ^void() {
    NSArray *unprocessedCrashReports = [MSWrapperCrashesHelper getUnprocessedCrashReports];
    resolve(convertReportsToJS(unprocessedCrashReports));
  };
  dispatch_async(dispatch_get_main_queue(), fetchUnprocessedCrashReports);
}

/**
 * Resumes processing for a list of error reports that is a subset of the unprocessed reports.
 */
RCT_EXPORT_METHOD(sendCrashReportsOrAwaitUserConfirmationForFilteredList:(NSArray *)filteredList
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  //TODO convert filteredList to an array of error reports
  [MSWrapperCrashesHelper sendCrashReportsOrAwaitUserConfirmationForFilteredList:filteredList];
  resolve(nil);
}

/**
 * Sends error attachments for a particular error report.
 */
RCT_EXPORT_METHOD(sendErrorAttachments:(NSArray *)errorAttachments
                  forErrorReport:(NSDictionary *)errorReport
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  //TODO convert items!
  [MSWrapperCrashesHelper sendErrorAttachments:errorAttachments forErrorReport:errorReport];
  resolve(nil);
}

@end

