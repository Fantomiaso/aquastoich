!ifndef BUILD_UNINSTALLER
!macro customInit
  ${IfNot} ${Silent}
    ReadRegStr $R0 SHELL_CONTEXT "${UNINSTALL_REGISTRY_KEY}" "DisplayVersion"
    ${IfNot} $R0 == ""
      MessageBox MB_OK|MB_ICONINFORMATION "AquaStoich $R0 is already installed. Setup will update the application and preserve journals and settings.$\r$\n$\r$\nAquaStoich $R0 уже установлена. Программа будет обновлена, журналы и настройки сохранятся."
    ${EndIf}
  ${EndIf}
!macroend

!else

!include "nsDialogs.nsh"

Var AquaStoichCleanData
Var AquaStoichUninstallDialog
Var AquaStoichKeepDataRadio
Var AquaStoichCleanDataRadio
Var AquaStoichBackupCheckbox

!macro customUnWelcomePage
  UninstPage custom un.AquaStoichUninstallOptionsCreate un.AquaStoichUninstallOptionsLeave
!macroend

Function un.AquaStoichUninstallOptionsCreate
  StrCpy $AquaStoichCleanData "0"
  nsDialogs::Create 1018
  Pop $AquaStoichUninstallDialog
  ${If} $AquaStoichUninstallDialog == error
    Abort
  ${EndIf}

  ${NSD_CreateLabel} 0 0 100% 22u "Choose what happens to local AquaStoich data.$\r$\nВыберите, что делать с локальными данными AquaStoich."
  Pop $R0

  ${NSD_CreateRadioButton} 0 30u 100% 18u "Keep journals and settings (recommended) / Сохранить журналы и настройки"
  Pop $AquaStoichKeepDataRadio
  ${NSD_Check} $AquaStoichKeepDataRadio
  ${NSD_OnClick} $AquaStoichKeepDataRadio un.AquaStoichUninstallChoiceChanged

  ${NSD_CreateRadioButton} 0 54u 100% 18u "Clean removal: delete all local data / Полное удаление всех локальных данных"
  Pop $AquaStoichCleanDataRadio
  ${NSD_OnClick} $AquaStoichCleanDataRadio un.AquaStoichUninstallChoiceChanged

  ${NSD_CreateCheckbox} 18u 82u 92% 24u "Create a JSON backup in Documents\AquaStoich Backups before deletion / Создать резервную копию JSON перед удалением"
  Pop $AquaStoichBackupCheckbox
  ${NSD_Check} $AquaStoichBackupCheckbox
  EnableWindow $AquaStoichBackupCheckbox 0

  ${NSD_CreateLabel} 0 116u 100% 34u "Clean removal permanently deletes aquarium profiles, journals, custom substances, presets and settings. A backup can be restored from inside AquaStoich.$\r$\nПолное удаление безвозвратно удалит аквариумы, журналы, пользовательские вещества, пресеты и настройки. Резервную копию можно восстановить из AquaStoich."
  Pop $R0

  nsDialogs::Show
FunctionEnd

Function un.AquaStoichUninstallChoiceChanged
  ${NSD_GetState} $AquaStoichCleanDataRadio $R0
  ${If} $R0 == ${BST_CHECKED}
    EnableWindow $AquaStoichBackupCheckbox 1
  ${Else}
    EnableWindow $AquaStoichBackupCheckbox 0
  ${EndIf}
FunctionEnd

Function un.AquaStoichUninstallOptionsLeave
  ${NSD_GetState} $AquaStoichCleanDataRadio $R0
  ${If} $R0 != ${BST_CHECKED}
    StrCpy $AquaStoichCleanData "0"
    Return
  ${EndIf}

  MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION|MB_DEFBUTTON2 \
    "This will permanently delete all local AquaStoich data.$\r$\n$\r$\nВсе локальные данные AquaStoich будут удалены без возможности восстановления." \
    IDOK AquaStoichCleanConfirmed IDCANCEL AquaStoichStayOnPage

  AquaStoichStayOnPage:
    Abort

  AquaStoichCleanConfirmed:
    ${NSD_GetState} $AquaStoichBackupCheckbox $R0
    ${If} $R0 == ${BST_CHECKED}
      Call un.checkAppRunning
      CreateDirectory "$DOCUMENTS\AquaStoich Backups"
      ExecWait '"$INSTDIR\${PRODUCT_FILENAME}.exe" "--export-backup-dir=$DOCUMENTS\AquaStoich Backups"' $R0
      ${If} $R0 != 0
        MessageBox MB_OK|MB_ICONSTOP "The backup could not be created. No data was deleted.$\r$\n$\r$\nНе удалось создать резервную копию. Данные не удалены."
        Abort
      ${EndIf}
      MessageBox MB_OK|MB_ICONINFORMATION "Backup saved in Documents\AquaStoich Backups.$\r$\n$\r$\nРезервная копия сохранена в Документы\AquaStoich Backups."
    ${EndIf}
    StrCpy $AquaStoichCleanData "1"
FunctionEnd

!macro customRemoveFiles
  ${If} ${isUpdated}
    CreateDirectory "$PLUGINSDIR\old-install"
    Push ""
    Call un.atomicRMDir
    Pop $R0
    ${If} $R0 != 0
      DetailPrint "File is busy, aborting: $R0"
      Push ""
      Call un.restoreFiles
      Pop $R0
      Abort `Can't rename "$INSTDIR" to "$PLUGINSDIR\old-install".`
    ${EndIf}
  ${EndIf}

  SetOutPath $TEMP
  RMDir /r $INSTDIR

  ${If} $AquaStoichCleanData == "1"
    IfFileExists "$INSTDIR\${APP_EXECUTABLE_FILENAME}" 0 AquaStoichRemoveLocalData
    Abort "AquaStoich could not be removed. Local data was preserved."

    AquaStoichRemoveLocalData:
      ${If} $installMode == "all"
        SetShellVarContext current
      ${EndIf}
      RMDir /r "$APPDATA\${APP_FILENAME}"
      !ifdef APP_PRODUCT_FILENAME
        RMDir /r "$APPDATA\${APP_PRODUCT_FILENAME}"
      !endif
      !ifdef APP_PACKAGE_NAME
        RMDir /r "$APPDATA\${APP_PACKAGE_NAME}"
      !endif
      ${If} $installMode == "all"
        SetShellVarContext all
      ${EndIf}
  ${EndIf}
!macroend

!endif
